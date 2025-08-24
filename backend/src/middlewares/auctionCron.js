import cron from "node-cron";
import Auction from "../models/auctionModel.js";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Upcoming → Ongoing
    await Auction.updateMany(
      { status: "upcoming", startDateTime: { $lte: now } },
      { $set: { status: "ongoing" } }
    );

    // Ongoing → Past (1 hour after endDateTime)
    const ongoingAuctions = await Auction.find({ status: "ongoing" });
    for (let auction of ongoingAuctions) {
      const endPlus1Hr = new Date(auction.endDateTime.getTime() + 60 * 60 * 1000);
      if (now >= endPlus1Hr) {
        auction.status = "past";
        await auction.save();
      }
    }

    console.log("Auction statuses updated at", now);
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
