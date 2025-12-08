import cron from "node-cron";
import Auction from "../models/auctionModel.js";
import Bid from "../models/bidModel.js";
import User from "../models/userModel.js";
import AuctionReport from "../models/auctionReportModel.js";

cron.schedule("* * * * *", async () => {
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
        endDateTime: { $lte: new Date(now - 60 * 60 * 1000) },
      },
      { $set: { status: "past" } }
    );

    const updatedPastFromUpcoming = await Auction.updateMany(
      {
        status: "upcoming",
        endDateTime: { $lte: new Date(now - 60 * 60 * 1000) },
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

      // Safety: skip if a report already exists for this auction (prevents duplicates)
      const existingReport = await AuctionReport.findOne({ auctionId: auction._id });
      if (existingReport) {
        console.log(`Report already exists for auction ${auction._id}, marking auction.reportGenerated = true`);
        // Ensure auction has the flag set (persist it)
        try {
          auction.reportGenerated = true;
          await auction.save();
        } catch (err) {
          console.warn('Failed to persist reportGenerated flag for auction', auction._id, err);
        }
        continue;
      }

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
      });

      // ✔ Stop duplicate reports
      auction.reportGenerated = true;
      await auction.save();

      console.log("Report generated for auction:", auction._id);
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
