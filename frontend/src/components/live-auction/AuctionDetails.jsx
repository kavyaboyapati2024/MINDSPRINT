import React from "react";
import { Shield, Lock } from "lucide-react";

const AuctionDetails = ({ bidders }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <h3 className="text-xl font-bold text-sky-400 mb-4">Auction Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-300">Starting Bid:</span>
          <span className="text-white font-semibold">₹1,00,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Auction Type:</span>
          <span className="text-sky-400 font-semibold">Sealed Bid</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Total Bidders:</span>
          <span className="text-white font-semibold">{bidders.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Security:</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">
              Quantum Secured
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-700">
          <div className="flex items-center space-x-2 text-sm">
            <Lock className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300">
              All bids are encrypted and sealed until auction ends
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
