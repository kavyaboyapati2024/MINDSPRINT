import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import { generateToken } from "../lib/utils.js";
import { sendOtp, verifyOtp } from "../services/sendOtp.js";
import { sendMail } from "../services/sendMail.js";
import { generateOtpToken, verifyOtpToken } from "../services/otpToken.js";

dotenv.config();

//Function to register user
export const registerUser = async (req, res) => {
  const { email, userName, password, otp, verifyToken } = req.body;
  const lowerEmail = email.toLowerCase();

  try {
    // STEP 0: Check if already exists
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    // STEP 1: No OTP → send OTP
    if (!verifyToken && !otp) {
      return await sendOtp(req, res);
    }

    // STEP 2: OTP entered → verify OTP
    if (!verifyToken && email && otp) {
      const otpResult = await verifyOtp(lowerEmail, otp);
      return res.status(otpResult.status).json(otpResult);
    }

    // STEP 3: OTP token verified → create account
    if (userName && verifyToken) {
      const tokenResult = await verifyOtpToken(lowerEmail, verifyToken);
      if (!tokenResult.success) {
        return res.status(tokenResult.status).json(tokenResult);
      }

      // Validation
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      const userNameTaken = await User.findOne({ userName });
      if (userNameTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
      }

      // Hash password & save
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        userName,
        email: lowerEmail,
        password: hashedPassword,
      });
      await newUser.save();

      // Send Welcome Email
      const welcomeHtml = `
        <div style=style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; border-radius: 10px;">
          <h2 style="color: #2c3e50;">🎉 Welcome, ${userName}!</h2>
          <p>Thank you for joining <b>EQ-Auction</b>.</p>
          <p>You can now log in and start bidding securely.</p>
          <br>
          <p style="font-size: 14px; color: #555;">Best Regards,<br/>Team EQ-Auction</p>
        </div>
      `;
      await sendMail(lowerEmail, welcomeHtml, "🎉 Welcome to EQ-Auction!");

      return res.status(201).json({
        success: true,
        message: "Registration successful. Welcome email sent.",
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Required fields not provided" });
  } catch (err) {
    console.error("Registration Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

//Function to login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Please enter your password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    generateToken(user._id, res);
    // If everything is okay, login successful
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Function to update password
export const updatePassword = async (req, res) => {
  // Convert inputs to strings to avoid type errors
  const email = String(req.body.email || "").trim();
  const currentPassword = String(req.body.currentPassword || "").trim();
  const newPassword = String(req.body.newPassword || "").trim();

  try {
    // Check if all fields are present
    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }
    if (!currentPassword) {
      return res
        .status(400)
        .json({ message: "Please enter your current password" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "Please enter a new password" });
    }

    // Validate new password length and content
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }
    if (newPassword.includes(" ") || newPassword.length > 100) {
      return res.status(400).json({ message: "Invalid new password content" });
    }

    // Check if current password is the same as new password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as current password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Password update error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Function to forgot password
export const forgotPassword = async (req, res) => {
  const { email, otp, resetToken, newPassword } = req.body;
  const lowerEmail = email.toLowerCase();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your registered email.",
    });
  }

  try {
    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email." });
    }

    // First Hit - email only → send OTP
    if (!otp && !newPassword) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; background-color: #fafafa; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #3498db;">🔐 Reset Your EQ-Auction Password</h2>
          <p>Hello ${user.userName},</p>
          <p>We received a request to reset your password. Use the One-Time Password (OTP) below to proceed:</p>
          <p style="font-size: 24px; font-weight: bold; color: #e74c3c; text-align: center;">{{OTP}}</p>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <br>
          <p style="font-size: 14px; color: #555;">Best Regards,<br/>Team EQ-Auction</p>
        </div>


      `;
      return await sendOtp(req, res, htmlContent);
    }

    // Second Hit - Email + OTP → verify OTP
    if (otp && !newPassword && !resetToken) {
      const otpResult = await verifyOtp(lowerEmail, otp);
      if (!otpResult.success) {
        return res.status(otpResult.status).json(otpResult);
      }

      const token = generateOtpToken(lowerEmail);
      return res.status(200).json({
        success: true,
        status: 200,
        message:
          "OTP verified successfully. Use the reset token to set a new password.",
        resetToken: token,
        expiresIn: 300, // 5 minutes
      });
    }

    // Third Hit - Email + Reset Token + New Password → reset password
    if (newPassword && resetToken) {
      const tokenResult = await verifyOtpToken(lowerEmail, resetToken);
      if (!tokenResult.success) {
        return res.status(tokenResult.status).json(tokenResult);
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "New password must be at least 6 characters long.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.updateOne(
        { email: lowerEmail },
        { $set: { password: hashedPassword } }
      );

      return res.status(200).json({
        success: true,
        status: 200,
        message:
          "Your password has been updated successfully. You can now log in with your new password.",
      });
    }

    return res.status(400).json({
      success: false,
      status: 400,
      message: "Required information missing. Please check and try again.",
    });
  } catch (err) {
    console.error("Forgot-Password Error:", err);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error. Please try again later.",
    });
  }
};

//Function for user logout
export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (e) {
    console.error("Error during logout:", e.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
