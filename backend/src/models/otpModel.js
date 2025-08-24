import mongoose from "mongoose";

// Otp schema definition
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Only allow one OTP per email at a time
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Create OTP model
const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
