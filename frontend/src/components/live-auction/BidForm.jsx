import React from "react";
import { IndianRupee, Eye, Lock } from "lucide-react";

const BidForm = ({ bidAmount, setBidAmount, handleSubmitBid }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <h3 className="text-lg font-bold text-sky-400 mb-4 text-center">
        Place Your Sealed Bid
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Bid Amount (INR)
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
              placeholder="Enter your bid amount"
              min="100000"
              step="0.01"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Minimum bid: ₹1,00,000.00
          </p>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <span className="text-sky-400 text-sm font-medium">
              Sealed Bid Protection
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Your bid amount will remain completely confidential and encrypted
            until the auction ends. No other bidders can see your bid.
          </p>
        </div>

        <button
          onClick={handleSubmitBid}
          className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
        >
          <span className="flex items-center justify-center">
            <Lock className="w-5 h-5 mr-2" />
            Submit Sealed Bid
          </span>
        </button>
      </div>
    </div>
  );
};

export default BidForm;
