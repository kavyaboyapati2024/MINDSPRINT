import React from "react";
import { Shield, Users, Lock } from "lucide-react";

const BiddersList = ({ bidders }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-sky-400">Active Bidders</h3>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-sky-400" />
          <span className="text-sky-400 font-semibold">
            {bidders.filter((b) => b.status === "active").length}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bidders.map((bidder) => (
          <div
            key={bidder.id}
            className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/50"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  bidder.status === "active" ? "bg-green-400" : "bg-slate-500"
                }`}
              ></div>
              <div>
                <p className="text-white text-sm font-medium">{bidder.name}</p>
                <p
                  className={`text-xs ${
                    bidder.status === "active"
                      ? "text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  {bidder.status === "active" ? "Active" : "Waiting"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3 text-sky-400" />
                <span className="text-sky-400 text-xs">Sealed</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="bg-slate-800/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="text-sky-400 text-sm font-medium">
              Privacy Protected
            </span>
          </div>
          <p className="text-xs text-slate-300">
            All bid amounts remain confidential until auction completion. Bidder
            identities are anonymized for fair competition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BiddersList;
