import jwt from 'jsonwebtoken';
export const generateOtpToken = (email) => {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '5m' // Token will expire in 7 days
    });
    //return token
    return token;
}

//verify otp token
export const verifyOtpToken = async (email, token) => {
  try {
    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Check email match
    if (decoded.email !== email) {
      return { success: false, status: 401, message: 'Email mismatch',
      };
    }
    // All good
    return {
      success: true, status: 200, message: 'Token verified successfully',
    };
  } catch (err) {
    return { success: false, status: 500, message: 'Error verifying OTP', error: err.message,
    };
  }
}
