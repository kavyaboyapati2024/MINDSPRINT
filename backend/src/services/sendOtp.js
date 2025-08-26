import dotenv from 'dotenv';
import Otp from '../models/otpModel.js';
import { sendMail } from './sendMail.js';
import { generateOtpToken } from './otpToken.js';
dotenv.config();

export const sendOtp = async (req, res, htmlContent) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Fallback default template if none provided
    const defaultHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; background-color: #fafafa; border-radius: 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #FEA203;">🔐 Verify Your Quantum-Bid Account</h2>
        <p>Use the OTP below to complete your registration:</p>
        <p style="font-size: 24px; font-weight: bold; color: #e74c3c; text-align: center;">{{OTP}}</p>
        <p>This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p style="font-size: 14px; color: #555;">Best Regards,<br/>Team Quantum-Bid</p>
      </div>
    `;

    const htmlReplacedContent = (htmlContent || defaultHtml).replace(/{{OTP}}/g, otpCode);

    try {
        await Otp.findOneAndUpdate(
            { email: email.toLowerCase() },
            { otp: otpCode, otpExpiry: expiry },
            { upsert: true, new: true }
        );

        await sendMail(email, htmlReplacedContent, 'Your OTP Code');
        //console.log(`📧 Sent OTP ${otpCode} to ${email}`);
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error sending OTP', error: err.message });
    }
};

export const verifyOtp = async (email, otp) => {
    if (!email || !otp) {
        return {
            success: false,
            status: 400,
            message: 'Email and OTP are required',
        };
    }

    try {
        const record = await Otp.findOne({ email: email.toLowerCase() });

        if (!record) {
            return {
                success: false,
                status: 404,
                message: 'No OTP found for this email',
            };
        }

        if (record.otp !== otp) {
            return {
                success: false,
                status: 401,
                message: 'Invalid OTP',
            };
        }

        if (record.otpExpiry < new Date()) {
            return {
                success: false,
                status: 410,
                message: 'OTP expired',
            };
        }

        const token = await generateOtpToken(email.toLowerCase());
        await Otp.deleteOne({ email: email.toLowerCase() });

        return {
            success: true,
            status: 200,
            message: 'OTP verified successfully',
            verifyToken: token
        };
    } catch (err) {
        return {
            success: false,
            status: 500,
            message: 'Error verifying OTP',
            error: err.message,
        };
    }
};
