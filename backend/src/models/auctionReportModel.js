import mongoose from "mongoose";

const auctionReportSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  seller: {
    id: String,
    name: String,
    email: String,
  },
  winner: {
    id: String,
    name: String,
    email: String,
  },
  item: {
    title: String,
    basePrice: Number,
    description: String,
    image: String,
  },
  biddingStats: {
    totalBids: Number,
    bidHistory: [
      {
        bidderId: String,
        bidderName: String,
        amount: Number,
        time: Date,
      },
    ],
  },
  finalStatus: {
    type: String,
    enum: ["Sold", "Unsold"],
    default: "Unsold",
  },
  finalPrice: {
    type: Number,
    default: 0,
  },
  reportGenerated: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AuctionReport", auctionReportSchema);
