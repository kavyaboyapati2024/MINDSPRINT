import React from 'react';
import { Star } from 'lucide-react';

const SuccessStep = ({ onStartBidding }) => {
  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 
        shadow-[0_0_30px_rgba(34,197,94,0.4),0_8px_16px_rgba(0,0,0,0.3),0_0_60px_rgba(34,197,94,0.2)]">
        <Star className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-white mb-4"
          style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'}}>
        Welcome to Quantum-Bid! 🎉
      </h2>

      <p className="text-slate-300/90 text-lg leading-relaxed">
        Your account has been created successfully.<br/>
        A welcome email has been sent to your inbox.
      </p>

      <button
        onClick={onStartBidding} // Use the prop here
        className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-300 text-sm sm:text-base
          shadow-[0_0_20px_rgba(34,197,94,0.3),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(34,197,94,0.15)] 
          hover:shadow-[0_0_30px_rgba(34,197,94,0.4),0_12px_24px_rgba(0,0,0,0.35),0_0_60px_rgba(34,197,94,0.2)] 
          hover:scale-105"
        style={{textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'}}
      >
        Start Bidding Now!
      </button>
    </div>
  );
};

export default SuccessStep;
