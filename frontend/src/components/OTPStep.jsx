import React from 'react';

const OTPStep = ({ formData, errors, isLoading, onOTPChange, onVerifyOTP, onResendOTP, onBack }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2"
            style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'}}>
          Enter Verification Code
        </h2>
        <p className="text-slate-400/80 text-sm sm:text-base px-2 sm:px-0">Check your email for the 6-digit code</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-center gap-2 sm:gap-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={formData.otp[index] || ''}
              onChange={(e) => onOTPChange(e, index)}
              onKeyDown={(e) => {
                // Handle backspace to move to previous input
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                  const prevInput = e.target.parentNode.children[index - 1];
                  if (prevInput) prevInput.focus();
                }
              }}
              className={`w-9 h-10 sm:w-10 sm:h-11 bg-slate-800/70 border rounded-lg text-white text-center text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm 
                shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_8px_rgba(0,0,0,0.2)] 
                hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_12px_rgba(0,0,0,0.3)] 
                focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_15px_rgba(14,165,233,0.3),0_4px_8px_rgba(0,0,0,0.2)] ${
                errors.otp ? 'border-red-400/60 ring-2 ring-red-400/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_12px_rgba(248,113,113,0.25),0_2px_4px_rgba(0,0,0,0.2)]' : 'border-slate-600/70 hover:border-sky-500/40'
              }`}
              style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
            />
          ))}
        </div>
        
        {errors.otp && (
          <p className="text-red-400 text-xs sm:text-sm text-center animate-in slide-in-from-top duration-300">{errors.otp}</p>
        )}
      </div>

      <button
        onClick={onVerifyOTP}
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
            Verifying...
          </div>
        ) : (
          'Verify Code'
        )}
      </button>

      <div className="text-center">
        <button
          onClick={onResendOTP}
          disabled={isLoading}
          className="text-sky-400 hover:text-sky-300 transition-colors duration-300 text-sm font-medium disabled:opacity-50"
          style={{textShadow: '0 0 10px rgba(14, 165, 233, 0.3)'}}
        >
          Resend Code
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full py-2 text-sky-400 hover:text-sky-300 transition-colors duration-300 text-sm"
        style={{textShadow: '0 0 10px rgba(14, 165, 233, 0.3)'}}
      >
        ← Back to Email
      </button>
    </div>
  );
};

export default OTPStep;