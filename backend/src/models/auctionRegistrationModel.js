import mongoose from "mongoose";

const auctionRegistrationSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction", // Reference to Auction
    required: true,
  },
  auctionerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auctioner", // Reference to Auction
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const AuctionRegistration = mongoose.model(
  "AuctionRegistration",
  auctionRegistrationSchema
);

export default AuctionRegistration;