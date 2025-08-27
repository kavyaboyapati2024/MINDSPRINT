import React from "react";
import { Gavel } from "lucide-react";

const AuctionItem = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center border border-slate-600/50">
        <div className="text-center">
          <Gavel className="w-16 h-16 text-sky-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg font-medium">
            Premium Digital Asset
          </p>
          <p className="text-slate-400 text-sm mt-2">High Resolution Image</p>
        </div>
      </div>
    </div>
  );
};

export default AuctionItem;
