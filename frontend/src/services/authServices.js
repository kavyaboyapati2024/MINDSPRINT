// API service for authentication
const API_BASE_URL = 'http://localhost:9000/api/authUsers';

class AuthService {
  // Step 1: Send OTP to email
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

  // Step 2: Verify OTP
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
      
      // Store user data in session storage after successful registration
      if (response.ok && data.user) {
        this.setUserData(data.user);
      }
      
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
      
      // Store user data in session storage after successful login
      if (response.ok && data.user) {
        this.setUserData(data.user);
      }
      
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

  // Store user data in session storage
  static setUserData(userData) {
    try {
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('User data stored in session storage:', userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Get current logged-in user from session storage
  static getCurrentUser() {
    try {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const user = this.getCurrentUser();
    return user !== null;
  }

  // Clear user data from session storage
  static clearUserData() {
    try {
      sessionStorage.removeItem('user');
      console.log('User data cleared from session storage');
    } catch (error) {
      console.error('Error clearing user data:', error);
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
      
      // Clear user data from session storage after logout
      if (response.ok) {
        this.clearUserData();
      }
      
      return {
        success: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Logout Error:', error);
      // Clear session storage even if API call fails
      this.clearUserData();
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