import React from "react";
import { Lock } from "lucide-react";

const ConfirmBidModal = ({ isOpen, bidAmount, confirmBid, cancelBid }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-sky-500/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-md w-full relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Confirm Your Bid
            </h3>
            <p className="text-slate-300 text-sm">
              Are you sure you want to submit your sealed bid?
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Your Bid Amount:</span>
              <span className="text-white font-bold text-lg">
                ₹{parseFloat(bidAmount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>
                This bid will be encrypted and sealed until auction ends
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={cancelBid}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-300 border border-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmBid}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                <Lock className="w-4 h-4 mr-2" />
                Confirm Bid
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBidModal;
