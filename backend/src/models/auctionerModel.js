import mongoose from "mongoose";

const auctionerSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["personal", "organization"],
      required: true,
    },

    // ----------- PERSONAL ACCOUNT FIELDS -----------
    fullName: {
      type: String,
      required: function () {
        return this.accountType === "personal";
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.accountType === "personal";
      },
    },

    // ----------- ORGANIZATION ACCOUNT FIELDS -----------
    organizationName: {
      type: String,
      required: function () {
        return this.accountType === "organization";
      },
    },
    contactPersonName: {
      type: String,
      required: function () {
        return this.accountType === "organization";
      },
    },
    contactPersonPhone: {
      type: String,
      required: function () {
        return this.accountType === "organization";
      },
    },

    // ----------- COMMON: EMAIL + PASSWORD -----------
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Verification Flags
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Government / Tax Details
    govtIdOrRegNo: { type: String }, // Required only for organization
    gst: { type: String }, // Optional for both

    // Address
    address: { type: String },
  },
  { timestamps: true }
);

const Auctioner = mongoose.model("Auctioner", auctionerSchema);
export default Auctioner;
