import React from "react";
import { Shield, Clock } from "lucide-react";

const AuctionStatusBar = () => {
  return (
    <div className="mt-8 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-xl p-4 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300 text-sm">Auction Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300 text-sm">Quantum Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300 text-sm">Real-time Updates</span>
          </div>
        </div>
        <div className="text-slate-400 text-sm">Auction ID: #AUC-2024-001</div>
      </div>
    </div>
  );
};

export default AuctionStatusBar;
