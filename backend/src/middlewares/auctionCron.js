import cron from "node-cron";
import Auction from "../models/auctionModel.js";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    console.log("Cron tick at:", now.toISOString());

    // ✅ Transition: Upcoming → Ongoing
    // Only update if still upcoming AND within the active timeframe
    const updatedOngoing = await Auction.updateMany(
      { 
        status: "upcoming",
        startDateTime: { $lte: now },
        endDateTime: { $gte: now }
      },
      { $set: { status: "ongoing" } }
    );

    // ✅ Transition: Ongoing → Past (after 1h grace)
    const updatedPastFromOngoing = await Auction.updateMany(
      { 
        status: "ongoing",
        endDateTime: { $lte: new Date(now - 60 * 60 * 1000) } // grace applied
      },
      { $set: { status: "past" } }
    );

    // ✅ Safety net: Upcoming that already ended (missed start/ongoing window)
    const updatedPastFromUpcoming = await Auction.updateMany(
      { 
        status: "upcoming",
        endDateTime: { $lte: new Date(now - 60 * 60 * 1000) } // also apply grace
      },
      { $set: { status: "past" } }
    );

    const totalPast =
      updatedPastFromOngoing.modifiedCount +
      updatedPastFromUpcoming.modifiedCount;

    if (updatedOngoing.modifiedCount || totalPast) {
      console.log(
        `Auction updates → Ongoing: ${updatedOngoing.modifiedCount}, Past: ${totalPast}`
      );
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
