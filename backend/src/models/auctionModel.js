import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    minIncrement: { type: Number, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    file: { type: String, required: true },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "past"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);
