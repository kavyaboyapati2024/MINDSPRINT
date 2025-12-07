// API service for authentication
const API_BASE_URL = 'http://localhost:9000/api/authUsers';
const AUCTIONEER_API_BASE_URL = 'http://localhost:9000/api/auctioners';

class AuthService {
  // Step 1: Send OTP to email (for regular users)
  static async sendOTP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Send OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Step 1: Send OTP to email (for auctioneers)
  static async sendAuctioneerOTP(email) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Send Auctioneer OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Step 2: Verify Auctioneer OTP
  static async verifyAuctioneerOTP(email, otp) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Verify Auctioneer OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Step 3: Complete auctioneer registration
  static async completeAuctioneerRegistration(registrationData) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Complete Auctioneer Registration Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Step 2: Verify OTP (for regular users)
  static async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Verify OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Step 3: Complete registration
  static async completeRegistration(email, userName, password, verifyToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          userName, 
          password, 
          verifyToken 
        })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Complete Registration Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Login user
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Login Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Auctioneer login
  static async auctioneerLogin(email, password) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Auctioneer Login Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Logout user
  static async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Logout Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Forgot password - Send OTP
  static async forgotPasswordSendOTP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Forgot Password Send OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Auctioneer - Forgot password - Send OTP
  static async forgotAuctioneerSendOTP(email) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Forgot Auctioneer Send OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Auctioneer - Forgot password - Verify OTP
  static async forgotAuctioneerVerifyOTP(email, otp) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Forgot Auctioneer Verify OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Auctioneer - Forgot password - Reset password
  static async resetAuctioneerPassword(email, newPassword, resetToken) {
    try {
      const response = await fetch(`${AUCTIONEER_API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, resetToken, newPassword })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Forgot Auctioneer Reset Password Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Forgot password - Verify OTP
  static async forgotPasswordVerifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Forgot Password Verify OTP Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Forgot password - Reset password
  static async resetPassword(email, newPassword, resetToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword, resetToken })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Reset Password Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Update password
  static async updatePassword(email, currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, currentPassword, newPassword })
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Update Password Error:', error);
      return {
        success: false,
        status: 500,
        message: 'Network error. Please check your connection and try again.',
        error: error.message
      };
    }
  }

  // Helper method to handle common network errors
  static handleNetworkError(error) {
    console.error('Network Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        status: 0,
        message: 'Unable to connect to server. Please check if the backend is running on port 9000.',
        error: error.message
      };
    }
    
    return {
      success: false,
      status: 500,
      message: 'Network error. Please try again.',
      error: error.message
    };
  }
}

export default AuthService;