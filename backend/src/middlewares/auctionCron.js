import cron from "node-cron";
import Auction from "../models/auctionModel.js";
import Bid from "../models/bidModel.js";
import User from "../models/userModel.js";
import Auctioner from "../models/auctionerModel.js";
import AuctionReport from "../models/auctionReportModel.js";
import AuctionerKey from "../models/auctionerKeyModel.js";
import { DecryptBid } from "../services/encryption.js";
import { sendMail } from "../services/sendMail.js";
import { generateAuctionWinnerEmail } from "../services/auctionWinnerEmailTemplate.js";
import { generateAuctionLoserEmail } from "../services/auctionLoserEmailTemplate.js";

cron.schedule("0 * * * * *", async () => {
  try {
    const now = new Date();

    // ---------------- Existing Status Update Logic ----------------
    const updatedOngoing = await Auction.updateMany(
      {
        status: "upcoming",
        startDateTime: { $lte: now },
        endDateTime: { $gte: now },
      },
      { $set: { status: "ongoing" } }
    );

    const updatedPastFromOngoing = await Auction.updateMany(
      {
        status: "ongoing",
        endDateTime: { $lte: now },
      },
      { $set: { status: "past" } }
    );

    const updatedPastFromUpcoming = await Auction.updateMany(
      {
        status: "upcoming",
        endDateTime: { $lte: now },
      },
      { $set: { status: "past" } }
    );
    // --------------------------------------------------------------

    // 🔍 Find newly completed auctions (without report)
    const completedAuctions = await Auction.find({
      status: "past",
      reportGenerated: { $ne: true },
    });

    for (const auction of completedAuctions) {
      console.log("Generating report for:", auction._id);

      // Fetch all bids for this auction and attempt to decrypt amounts
      const bids = await Bid.find({ auctionId: auction._id });

      // Map to decrypted numeric bids. We'll skip any bids that cannot be decrypted to a valid number.
      const decryptedBids = [];
      const userCache = new Map();

      for (const b of bids) {
        try {
          const auctionerKey = await AuctionerKey.findOne({ auctionId: auction._id, userId: b.userId });
          if (!auctionerKey) {
            console.warn("No auctioner key for bid, skipping decryption:", b._id.toString());
            continue;
          }

          let decrypted = null;
          try {
            decrypted = DecryptBid(auctionerKey.key, b.amount);
          } catch (dErr) {
            console.error("Failed to decrypt bid", b._id.toString(), dErr.message);
            continue;
          }

          const amountNum = parseFloat(decrypted);
          if (Number.isNaN(amountNum)) {
            console.warn("Decrypted bid is not a number, skipping:", b._id.toString(), decrypted);
            continue;
          }

          // fetch user name once and cache
          let userName = "";
          if (userCache.has(b.userId.toString())) {
            userName = userCache.get(b.userId.toString());
          } else {
            const u = await User.findById(b.userId).select("userName");
            userName = u?.userName || "";
            userCache.set(b.userId.toString(), userName);
          }

          decryptedBids.push({
            bid: b,
            amount: amountNum,
            bidderName: userName,
          });
        } catch (err) {
          console.error("Error processing bid for auction", auction._id.toString(), err.message);
        }
      }

      const totalBids = decryptedBids.length;
      // Determine highest numeric bid
      decryptedBids.sort((x, y) => y.amount - x.amount);
      const highestProcessed = decryptedBids[0] || null;

      let finalStatus = "Unsold";
      let finalPrice = 0;
      let winner = null;

      if (highestProcessed) {
        finalStatus = "Sold";
        finalPrice = highestProcessed.amount;

        const winnerUser = await User.findById(highestProcessed.bid.userId).select("userName email");
        winner = {
          id: winnerUser?._id ? winnerUser._id.toString() : "",
          name: winnerUser?.userName || "Unknown",
          email: winnerUser?.email || "Unknown",
        };
      }

      // Seller Information
      const sellerUser = await Auctioner.findById(auction.auctionerId);

      const sellerName = sellerUser?.fullName || sellerUser?.organizationName || sellerUser?.contactPersonName || "Unknown";

      // 📝 Create the report document
      await AuctionReport.create({
        auctionId: auction._id,
        seller: {
          id: sellerUser?._id || "",
          name: sellerName,
          email: sellerUser?.email || "Unknown",
        },
        winner,
        item: {
          // Prefer `title` on auction, fall back to legacy `itemName` if present
          title: auction.title || auction.itemName || "",
          name: auction.title || auction.itemName || "",
          basePrice: auction.basePrice,
          description: auction.description,
          image: auction.image,
        },
        biddingStats: {
          totalBids,
          bidHistory: decryptedBids.map((d) => ({
            bidderId: d.bid.userId,
            bidderName: d.bidderName,
            amount: d.amount,
            time: d.bid.createdAt,
          })),
        },
        finalStatus,
        finalPrice,
        reportGenerated: true,
      });

      // ✔ Stop duplicate reports — use an atomic update to ensure persistence
      try {
        const upd = await Auction.updateOne(
          { _id: auction._id },
          { $set: { reportGenerated: true } }
        );
        if (upd.matchedCount === 0) {
          console.warn("Failed to mark reportGenerated (no matching auction):", auction._id);
        } else {
          console.log("Marked auction.reportGenerated = true for:", auction._id);
        }
      } catch (uErr) {
        console.error("Failed to set reportGenerated for auction", auction._id, uErr);
      }

      // 📧 Send winner email
      if (winner && winner.email) {
        try {
          const winnerEmailHtml = generateAuctionWinnerEmail({
            userName: winner.name || "Bidder",
            auctionTitle: auction.title || auction.itemName,
            bidAmount: finalPrice,
            auctionEndDate: auction.endDateTime,
          });
          await sendMail(
            winner.email,
            winnerEmailHtml,
            `🏆 Congratulations! You won the auction for ${auction.title || auction.itemName}`
          );
          console.log("Winner email sent to:", winner.email);
        } catch (emailErr) {
          console.error("Failed to send winner email to", winner.email, emailErr);
        }
      }

      // 📧 Send loser emails to all other bidders
      try {
        const uniqueBidderIds = [...new Set(decryptedBids.map((d) => d.bid.userId.toString()))];
        const winnerIdStr = winner?.id ? winner.id.toString() : null;
        const loserIds = uniqueBidderIds.filter((id) => !winnerIdStr || id !== winnerIdStr);

        for (const loserId of loserIds) {
          try {
            const loserUser = await User.findById(loserId);
            if (loserUser && loserUser.email) {
              const loserEmailHtml = generateAuctionLoserEmail({
                userName: loserUser.userName || "Bidder",
                auctionTitle: auction.title || auction.itemName,
                auctionEndDate: auction.endDateTime,
              });
              await sendMail(
                loserUser.email,
                loserEmailHtml,
                `Auction ended for ${auction.title || auction.itemName}`
              );
              console.log("Loser email sent to:", loserUser.email);
            }
          } catch (loserEmailErr) {
            console.error("Failed to send loser email for user", loserId, loserEmailErr);
          }
        }
      } catch (losersErr) {
        console.error("Error processing loser emails for auction", auction._id, losersErr);
      }

      console.log("Report generated for auction:", auction._id);
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});