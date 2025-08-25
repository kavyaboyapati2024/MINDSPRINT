import React from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const RegistrationStep = ({ 
  formData, 
  errors, 
  isLoading, 
  showPassword, 
  onInputChange, 
  onTogglePassword, 
  onRegister, 
  onBack 
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2"
            style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'}}>
          Complete Your Profile
        </h2>
        <p className="text-slate-400/80 text-sm sm:text-base px-2 sm:px-0">Create your username and password</p>
      </div>
      
      <div className="space-y-6">
        <div className="relative">
          <User className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
                style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={onInputChange}
            placeholder="Choose a username"
            className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
              shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_10px_rgba(0,0,0,0.2)] 
              hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_15px_rgba(0,0,0,0.3)] 
              focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${
              errors.userName ? 'border-red-400/60 ring-2 ring-red-400/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_15px_rgba(248,113,113,0.25),0_4px_8px_rgba(0,0,0,0.2)]' : 'border-slate-600/70 hover:border-sky-500/40'
            }`}
            style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
          />
          {errors.userName && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.userName}</p>
          )}
        </div>

        <div className="relative">
          <Lock className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10" 
                style={{filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))'}} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Create a strong password"
            className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
              shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_10px_rgba(0,0,0,0.2)] 
              hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_15px_rgba(0,0,0,0.3)] 
              focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${
              errors.password ? 'border-red-400/60 ring-2 ring-red-400/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_15px_rgba(248,113,113,0.25),0_4px_8px_rgba(0,0,0,0.2)]' : 'border-slate-600/70 hover:border-sky-500/40'
            }`}
            style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'}}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.password && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.password}</p>
          )}
        </div>
      </div>

      <button
        onClick={onRegister}
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
            Creating Account...
          </div>
        ) : (
          'Complete Registration'
        )}
      </button>

      <button
        onClick={onBack}
        className="w-full py-2 text-sky-400 hover:text-sky-300 transition-colors duration-300 text-sm"
        style={{textShadow: '0 0 10px rgba(14, 165, 233, 0.3)'}}
      >
        ← Back to Verification
      </button>
    </div>
  );
};

export default RegistrationStep;