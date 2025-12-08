import cron from "node-cron";
import Auction from "../models/auctionModel.js";
import Bid from "../models/bidModel.js";
import User from "../models/userModel.js";
import AuctionReport from "../models/auctionReportModel.js";

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

      const bids = await Bid.find({ auctionId: auction._id }).sort({
        amount: -1,
      });

      const totalBids = bids.length;
      const highestBid = bids[0] || null;

      let finalStatus = "Unsold";
      let finalPrice = 0;
      let winner = null;

      if (highestBid) {
        finalStatus = "Sold";
        finalPrice = highestBid.amount;

        const winnerUser = await User.findById(highestBid.userId);
        winner = {
          id: winnerUser?._id || "",
          name: winnerUser?.name || "Unknown",
          email: winnerUser?.email || "Unknown",
        };
      }

      // Seller Information
      const sellerUser = await User.findById(auction.sellerId);

      // 📝 Create the report document
      await AuctionReport.create({
        auctionId: auction._id,
        seller: {
          id: sellerUser?._id || "",
          name: sellerUser?.name || "Unknown",
          email: sellerUser?.email || "Unknown",
        },
        winner,
        item: {
          title: auction.itemName,
          basePrice: auction.basePrice,
          description: auction.description,
          image: auction.image,
        },
        biddingStats: {
          totalBids,
          bidHistory: bids.map((b) => ({
            bidderId: b.userId,
            bidderName: b.bidderName,
            amount: b.amount,
            time: b.createdAt,
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

      console.log("Report generated for auction:", auction._id);
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});