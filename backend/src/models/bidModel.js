import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
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
    amount: {
      type: String,
      required: true, // encrypt before saving if you want secure bids
    },
    iv: {
      type: String, // IV in base64 (needed for decryption)
      required: true,
    },
     bidHash: {
      type: String, // optional, to verify when revealing
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
