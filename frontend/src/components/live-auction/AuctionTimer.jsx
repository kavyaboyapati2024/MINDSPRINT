import React from "react";

const AuctionTimer = ({ timeRemaining, formatTime }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-8 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)] text-center">
      <h3 className="text-lg font-bold text-sky-400 mb-6">Time Remaining</h3>
      <div className="relative">
        <div className="w-48 h-48 mx-auto border-4 border-sky-500 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-700/50">
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-2">
              {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
            </div>
            <div className="text-sky-400 text-sm font-medium">H : M : S</div>
          </div>
        </div>
        <div className="absolute inset-0 w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              cx="50%" cy="50%" r="90"
              stroke="currentColor" strokeWidth="4" fill="none"
              className="text-sky-500/30"
            />
            <circle 
              cx="50%" cy="50%" r="90"
              stroke="currentColor" strokeWidth="4" fill="none"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * 0.3}`}
              className="text-sky-400 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuctionTimer;
