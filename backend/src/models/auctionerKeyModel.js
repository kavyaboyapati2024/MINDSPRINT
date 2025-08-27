import mongoose from "mongoose";

const auctionerKeySchema = new mongoose.Schema({
  auctionerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auctioner",
    required: true,
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});

const AuctionerKey = mongoose.model("AuctionerKey", auctionerKeySchema);

export default AuctionerKey;