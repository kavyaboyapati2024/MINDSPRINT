import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuctionReport from '../src/models/auctionReportModel.js';
import Auction from '../src/models/auctionModel.js';

dotenv.config();

const MONGO = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindsprint';

async function dedupe() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  try {
    // Find duplicate reports grouped by auctionId
    const duplicates = await AuctionReport.aggregate([
      { $group: { _id: '$auctionId', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    console.log(`Found ${duplicates.length} auctionIds with duplicate reports`);

    for (const d of duplicates) {
      const keepId = d.ids[0]; // keep first
      const removeIds = d.ids.slice(1);
      console.log(`Keeping report ${keepId} for auction ${d._id}, removing ${removeIds.length} duplicates`);
      await AuctionReport.deleteMany({ _id: { $in: removeIds } });
    }

    // Now ensure each auction with a report has auction.reportGenerated = true
    const reports = await AuctionReport.find({}).select('auctionId');
    console.log(`Marking ${reports.length} auctions as reportGenerated`);
    for (const r of reports) {
      try {
        await Auction.updateOne({ _id: r.auctionId }, { $set: { reportGenerated: true } });
      } catch (err) {
        console.warn('Failed to set reportGenerated for auction', r.auctionId, err.message);
      }
    }

    console.log('Dedupe and marking complete');
  } catch (err) {
    console.error('Error during dedupe:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

if (require.main === module) {
  dedupe().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
