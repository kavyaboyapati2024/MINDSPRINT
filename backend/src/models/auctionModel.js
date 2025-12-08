import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    auctionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auctioner",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    file: { type: String, required: true },
    // Flag set when a report has been generated for this auction
    reportGenerated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "past"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);
