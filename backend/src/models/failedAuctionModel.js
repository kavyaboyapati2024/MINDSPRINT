import mongoose from 'mongoose';

const failedAuctionSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
    unique: true,
  },
  error: {
    type: String,
    default: null,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  lastErrorAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const FailedAuction = mongoose.model('FailedAuction', failedAuctionSchema);
export default FailedAuction;
