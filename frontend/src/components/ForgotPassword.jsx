import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle, Key, ArrowLeft, Send, Clock } from 'lucide-react';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Timer effect for OTP expiry
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && currentStep === 2) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [timer, currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) {
      setErrors({ email: 'Please enter your email' });
      return;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep(2);
        setTimer(300); // 5 minutes
        setCanResendOtp(false);
      } else {
        if (data.message === 'No account found with this email.') {
          setErrors({ email: 'No account found with this email' });
        } else {
          setErrors({ general: data.message || 'Failed to send OTP. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.otp) {
      setErrors({ otp: 'Please enter the OTP' });
      return;
    } else if (formData.otp.length !== 6) {
      setErrors({ otp: 'OTP must be 6 digits' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setCurrentStep(3);
        setTimer(300); // 5 minutes for password reset
      } else {
        setErrors({ general: data.message || 'Invalid or expired OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Please enter a new password';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          resetToken: resetToken,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(true);
      } else {
        setErrors({ general: data.message || 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setFormData(prev => ({ ...prev, otp: '' }));
    setCurrentStep(1);
    setErrors({});
    setTimer(0);
    setCanResendOtp(false);
  };

  const handleGoBack = () => {
    console.log('Going back to signin page');
    // You can implement navigation logic here
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-green-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-emerald-600/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-slate-700/50 relative overflow-hidden
            shadow-[0_0_0_1px_rgba(30,41,59,0.1),0_0_30px_rgba(0,0,0,0.6),0_0_60px_rgba(15,23,42,0.4),0_0_90px_rgba(15,23,42,0.2),0_20px_40px_rgba(0,0,0,0.3)]">
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 
              shadow-[0_0_30px_rgba(34,197,94,0.4),0_8px_16px_rgba(0,0,0,0.3),0_0_60px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4"
                style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'}}>
              Password Reset Complete! 🎉
            </h2>
            
            <p className="text-slate-300/90 text-lg leading-relaxed mb-8">
              Your password has been successfully reset.<br/>
              You can now sign in with your new password.
            </p>
            
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-lg hover:from-sky-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95
                shadow-[0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(14,165,233,0.15)]"
              style={{textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-sky-500/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-600/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-indigo-500/6 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/6 right-1/6 w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-slate-600/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-200 via-sky-200 to-white bg-clip-text text-transparent mb-2"
              style={{textShadow: '0 0 20px rgba(125, 211, 252, 0.3)'}}>
            EQ-Auction
          </h1>
          <p className="text-slate-300/90 text-base sm:text-lg font-medium px-4 sm:px-0"
             style={{textShadow: '0 0 10px rgba(148, 163, 184, 0.2)'}}>
            Reset Your Password
          </p>
        </div>

        {/* Enhanced Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-slate-700/50 relative overflow-hidden
          shadow-[0_0_0_1px_rgba(30,41,59,0.1),0_0_30px_rgba(0,0,0,0.6),0_0_60px_rgba(15,23,42,0.4),0_0_90px_rgba(15,23,42,0.2),0_20px_40px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0_0_1px_rgba(30,41,59,0.15),0_0_40px_rgba(0,0,0,0.7),0_0_80px_rgba(15,23,42,0.5),0_0_120px_rgba(15,23,42,0.3),0_25px_50px_rgba(0,0,0,0.4)]
          transition-all duration-700 hover:scale-[1.02] group">
          
          {/* Enhanced Card Glow Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/15 to-slate-700/10 rounded-2xl sm:rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-600/10 via-transparent to-slate-800/15 rounded-2xl sm:rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/5 via-transparent to-indigo-900/5 rounded-2xl sm:rounded-3xl group-hover:from-sky-900/8 group-hover:to-indigo-900/8 transition-all duration-700"></div>
          
          <div className="absolute inset-1 bg-gradient-to-br from-slate-600/8 via-transparent to-slate-700/8 rounded-2xl sm:rounded-3xl blur-sm"></div>
          
          <div className="relative z-10">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      currentStep >= step 
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                        currentStep > step ? 'bg-sky-400' : 'bg-slate-600'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Header Based on Step */}
            <div className="text-center mb-8">
              
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'}}>
                {currentStep === 1 && 'Forgot Password?'}
                {currentStep === 2 && 'Verify OTP'}
                {currentStep === 3 && 'Set New Password'}
              </h2>
              
              <p className="text-slate-400/80 text-sm sm:text-base">
                {currentStep === 1 && 'Enter your email to receive a verification code'}
                {currentStep === 2 && 'Enter the 6-digit code sent to your email'}
                {currentStep === 3 && 'Create a strong new password for your account'}
              </p>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in slide-in-from-top duration-300 mb-6">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Step 1: Email Input */}
            {currentStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
              style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
                        shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_10px_rgba(0,0,0,0.2)] 
                        hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_15px_rgba(0,0,0,0.3)] 
                        focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${
                        errors.email ? 'border-red-400/60 ring-2 ring-red-400/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_15px_rgba(248,113,113,0.25),0_4px_8px_rgba(0,0,0,0.2)]' : 'border-slate-600/70 hover:border-sky-500/40'
                      }`}
                      style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.email}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-sky-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all duration-300 text-sm sm:text-base transform active:scale-95
                    shadow-[0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(14,165,233,0.15)] 
                    hover:shadow-[0_0_30px_rgba(14,165,233,0.4),0_12px_24px_rgba(0,0,0,0.35),0_0_60px_rgba(14,165,233,0.2)] 
                    hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
                    disabled:shadow-[0_0_15px_rgba(14,165,233,0.15),0_4px_8px_rgba(0,0,0,0.2)]"
                  style={{textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                     
                      Send OTP
                    </div>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Verification Code</label>
                  <div className="relative">
                    <Shield className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
              style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base tracking-widest text-center font-mono
                        shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_10px_rgba(0,0,0,0.2)] 
                        hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_15px_rgba(0,0,0,0.3)] 
                        focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${
                        errors.otp ? 'border-red-400/60 ring-2 ring-red-400/30' : 'border-slate-600/70 hover:border-sky-500/40'
                      }`}
                      style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
                    />
                    {errors.otp && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.otp}</p>
                    )}
                  </div>
                  
                  {/* Timer and Resend */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {timer > 0 ? (
                        <span>Code expires in {formatTime(timer)}</span>
                      ) : (
                        <span className="text-red-400">Code expired</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResendOtp}
                      className="text-sky-400 hover:text-sky-300 disabled:text-slate-500 transition-colors duration-200 font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-sky-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all duration-300 text-sm sm:text-base transform active:scale-95
                    shadow-[0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(14,165,233,0.15)] 
                    hover:shadow-[0_0_30px_rgba(14,165,233,0.4),0_12px_24px_rgba(0,0,0,0.35),0_0_60px_rgba(14,165,233,0.2)] 
                    hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Verify OTP
                    </div>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {currentStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
              style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your new password"
                      className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
                        shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(34,197,94,0.1),0_0_10px_rgba(0,0,0,0.2)] 
                        hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(34,197,94,0.15),0_0_15px_rgba(0,0,0,0.3)] 
                        focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(34,197,94,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${
                        errors.newPassword ? 'border-red-400/60 ring-2 ring-red-400/30' : 'border-slate-600/70 hover:border-green-500/40'
                      }`}
                      style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {errors.newPassword && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.newPassword}</p>
                    )}
                  </div>
                  <p className="text-slate-500/80 text-xs">Password must be at least 6 characters long</p>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
              style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your new password"
                      className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
                        shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(34,197,94,0.1),0_0_10px_rgba(0,0,0,0.2)] 
                        hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(34,197,94,0.15),0_0_15px_rgba(0,0,0,0.3)] 
                        focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(34,197,94,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${
                        errors.confirmPassword ? 'border-red-400/60 ring-2 ring-red-400/30' : 'border-slate-600/70 hover:border-green-500/40'
                      }`}
                      style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Reset Time Warning */}
                {timer > 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-amber-400 text-sm">Reset token expires in {formatTime(timer)}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-300 text-sm sm:text-base transform active:scale-95
                    shadow-[0_0_20px_rgba(34,197,94,0.3),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(34,197,94,0.15)] 
                    hover:shadow-[0_0_30px_rgba(34,197,94,0.4),0_12px_24px_rgba(0,0,0,0.35),0_0_60px_rgba(34,197,94,0.2)] 
                    hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Key className="w-5 h-5 mr-2" />
                      Reset Password
                    </div>
                  )}
                </button>
              </form>
            )}

            {/* Back to Sign In Button */}
            <div className="mt-8">
              <button
                onClick={handleGoBack}
                className="w-full py-3 sm:py-3.5 bg-slate-700/70 text-slate-300 font-medium rounded-lg sm:rounded-xl hover:bg-slate-600/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all duration-300 text-sm sm:text-base transform active:scale-95
                  shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.2)] 
                  hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_6px_12px_rgba(0,0,0,0.25)] 
                  hover:scale-105"
                style={{textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}
              >
                <div className="flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Sign In
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;