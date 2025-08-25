import React from 'react';
import { Mail } from 'lucide-react';

const EmailStep = ({ formData, errors, isLoading, onInputChange, onSendOTP }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2"
            style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'}}>
          Enter Your Email
        </h2>
        <p className="text-slate-400/80 text-sm sm:text-base px-2 sm:px-0">We'll send you a verification code</p>
      </div>
      
      <div className="relative">
        <Mail className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
              style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
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

      <button
        onClick={onSendOTP}
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
          'Send Verification Code'
        )}
      </button>
    </div>
  );
};

export default EmailStep;