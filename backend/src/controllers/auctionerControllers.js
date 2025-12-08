import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Auctioner from "../models/auctionerModel.js";
import { generateToken } from "../lib/utils.js";
import { sendOtp, verifyOtp } from "../services/sendOtp.js";
import { sendMail } from "../services/sendMail.js";
import { generateOtpToken, verifyOtpToken } from "../services/otpToken.js";

dotenv.config();

//function to register auctioner
export const registerAuctioner = async (req, res) => {
  const {
    accountType,
    fullName,
    phoneNumber,
    organizationName,
    contactPersonName,
    contactPersonPhone,
    email,
    password,
    govtIdOrRegNo,
    gst,
    address,
    otp,
    verifyToken,
  } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const lowerEmail = email.toLowerCase();

  try {
    // STEP 1: If no OTP and no verifyToken → check existing & send OTP
    if (!otp && !verifyToken) {
      const existingAcc = await Auctioner.findOne({ email: lowerEmail });
      if (existingAcc) {
        return res.status(409).json({ success: false, message: "Auctioner already exists." });
      }
      return await sendOtp(req, res);
    }

    // STEP 2: OTP provided → verify OTP
    if (otp && !verifyToken) {
      const otpResult = await verifyOtp(lowerEmail, otp);
      return res.status(otpResult.status).json(otpResult);
    }

    // STEP 3: verifyToken provided → create account
    if (verifyToken) {
      const tokenResult = await verifyOtpToken(lowerEmail, verifyToken);
      if (!tokenResult.success) {
        return res.status(tokenResult.status).json(tokenResult);
      }

      const existingAcc = await Auctioner.findOne({ email: lowerEmail });
      if (existingAcc) {
        return res.status(409).json({ success: false, message: "Auctioner already exists." });
      }

      if (!accountType) {
        return res.status(400).json({ success: false, message: "Account type is required" });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
      }

      if (accountType === "personal" && (!fullName || !phoneNumber)) {
        return res.status(400).json({ success: false, message: "fullName & phoneNumber are required for personal account" });
      }

      if (
        accountType === "organization" &&
        (!organizationName || !contactPersonName || !contactPersonPhone || !govtIdOrRegNo)
      ) {
        return res.status(400).json({
          success: false,
          message: "organizationName, contactPersonName, contactPersonPhone, govtIdOrRegNo are required for organization account",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAuctioner = new Auctioner({
        accountType,
        fullName,
        phoneNumber,
        organizationName,
        contactPersonName,
        contactPersonPhone,
        email: lowerEmail,
        password: hashedPassword,
        govtIdOrRegNo,
        gst,
        address,
        isVerified: true,
      });

      await newAuctioner.save();

      const accName = accountType === "organization" ? organizationName : fullName;

      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; border-radius: 10px;">
          <h2 style="color: #2c3e50;">🎉 Welcome, ${accName}!</h2>
          <p>Your Auctioner account has been successfully created.</p>
          <p>You can now login and start auctioning securely.</p>
          <br>
          <p style="font-size: 14px; color: #555;">Best Regards,<br/>Team Quantum-Bid</p>
        </div>
      `;

      await sendMail(lowerEmail, welcomeHtml, "🎉 Welcome to Quantum-Bid!");

      return res.status(201).json({ success: true, message: "Auctioner registration successful." });
    }

    return res.status(400).json({ success: false, message: "Required values not provided" });
  } catch (err) {
    console.error("Auctioner Registration Error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

//function to login auctioner
export const loginAuctioner = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Please enter your email" });
    if (!password) return res.status(400).json({ message: "Please enter your password" });

    const auctioner = await Auctioner.findOne({ email: email.toLowerCase() });
    if (!auctioner) return res.status(401).json({ message: "Account not found" });

    if (!auctioner.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, auctioner.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    generateToken(auctioner._id, res);

    res.status(200).json({
      message: "Login successful",
      auctioner: {
        _id: auctioner._id,
        accountType: auctioner.accountType,
        email: auctioner.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//function to update password
export const updateAuctionerPassword = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const currentPassword = String(req.body.currentPassword || "").trim();
  const newPassword = String(req.body.newPassword || "").trim();

  try {
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const auctioner = await Auctioner.findOne({ email });
    if (!auctioner) return res.status(404).json({ message: "Account not found" });

    const isMatch = await bcrypt.compare(currentPassword, auctioner.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password too short" });

    const salt = await bcrypt.genSalt(10);
    auctioner.password = await bcrypt.hash(newPassword, salt);
    auctioner.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password Update Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//function to handle forgot password
export const forgotAuctionerPassword = async (req, res) => {
  const { email, otp, resetToken, newPassword } = req.body;
  const lowerEmail = email?.toLowerCase();

  if (!email)
    return res.status(400).json({ message: "Please enter your registered email" });

  try {
    const auctioner = await Auctioner.findOne({ email: lowerEmail });
    if (!auctioner)
      return res.status(404).json({ message: "No account found with this email" });

    // Step 1: Send OTP
    if (!otp && !newPassword) {
      const htmlContent = `<h3>Your OTP for resetting Auctioner Account:</h3>
      <p><strong>{{OTP}}</strong></p>`;
      return await sendOtp(req, res, htmlContent);
    }

    // Step 2: Verify OTP
    if (otp && !newPassword && !resetToken) {
      const result = await verifyOtp(lowerEmail, otp);
      if (!result.success) return res.status(result.status).json(result);

      const token = generateOtpToken(lowerEmail);
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        resetToken: token,
        expiresIn: 300,
      });
    }

    // Step 3: Reset Password
    if (newPassword && resetToken) {
      const tokenResult = await verifyOtpToken(lowerEmail, resetToken);
      if (!tokenResult.success)
        return res.status(tokenResult.status).json(tokenResult);

      if (newPassword.length < 6)
        return res.status(400).json({ message: "Password must be 6+ chars" });

      const salt = await bcrypt.genSalt(10);
      const hashedNewPass = await bcrypt.hash(newPassword, salt);

      await Auctioner.updateOne({ email: lowerEmail }, { $set: { password: hashedNewPass } });

      return res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
    }

    res.status(400).json({ message: "Invalid request format" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//function to logout auctioner
export const logoutAuctioner = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get auctioner details by id
export const getAuctionerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'auctioner id is required' });

    const auctioner = await Auctioner.findById(id).select('-password -__v');
    if (!auctioner) return res.status(404).json({ message: 'Auctioner not found' });

    // Return auctioner object directly
    return res.status(200).json({ auctioner });
  } catch (error) {
    console.error('getAuctionerById error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get auctioner display name by id (handles personal vs organization)
export const getAuctionerName = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'auctioner id is required' });

    const auctioner = await Auctioner.findById(id).select('accountType fullName organizationName contactPersonName email');
    if (!auctioner) return res.status(404).json({ success: false, message: 'Auctioner not found' });

    let name = 'Unknown';
    const acct = auctioner.accountType;
    if (acct === 'personal') {
      name = auctioner.fullName || auctioner.email || 'Auctioneer';
    } else if (acct === 'organization') {
      // prefer organizationName, fall back to contact person
      name = auctioner.organizationName || auctioner.contactPersonName || auctioner.email || 'Auctioneer';
    } else {
      name = auctioner.fullName || auctioner.organizationName || auctioner.contactPersonName || auctioner.email || 'Auctioneer';
    }

    return res.status(200).json({ success: true, auctionerId: id, accountType: acct || null, name });
  } catch (error) {
    console.error('getAuctionerName error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


