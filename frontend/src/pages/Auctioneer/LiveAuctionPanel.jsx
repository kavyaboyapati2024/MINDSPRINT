import React, { useState, useEffect } from 'react';
import { Gavel, Users, Play, Pause, StopCircle, Eye, EyeOff, Trophy, Clock, AlertCircle, Shield, Lock, TrendingUp, Activity } from 'lucide-react';

const AuctioneerLivePage = () => {
  const [auctionStatus, setAuctionStatus] = useState('active'); // active, paused, ended
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [revealBids, setRevealBids] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  
  // Mock bidder data with sealed bids
  const [bidders] = useState([
    { id: 1, name: 'Bidder Alpha', status: 'active', bidAmount: 150000, bidTime: '14:23:45' },
    { id: 2, name: 'Bidder Beta', status: 'active', bidAmount: 175000, bidTime: '14:24:12' },
    { id: 3, name: 'Bidder Gamma', status: 'active', bidAmount: 162000, bidTime: '14:25:03' },
    { id: 4, name: 'Bidder Delta', status: 'active', bidAmount: 180000, bidTime: '14:26:34' },
    { id: 5, name: 'Bidder Epsilon', status: 'waiting', bidAmount: 0, bidTime: null },
    { id: 6, name: 'Bidder Zeta', status: 'active', bidAmount: 145000, bidTime: '14:22:18' }
  ]);

  const activeBidders = bidders.filter(b => b.status === 'active');
  const highestBid = Math.max(...activeBidders.map(b => b.bidAmount));
  const averageBid = activeBidders.reduce((sum, b) => sum + b.bidAmount, 0) / activeBidders.length;

  useEffect(() => {
    if (auctionStatus !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          setAuctionStatus('ended');
          return prev;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionStatus]);

  const formatTime = (num) => num.toString().padStart(2, '0');

  const handlePauseResume = () => {
    setAuctionStatus(prev => prev === 'active' ? 'paused' : 'active');
  };

  const handleEndAuction = () => {
    setAuctionStatus('ended');
    setRevealBids(true);
  };

  const handleRevealBids = () => {
    setRevealBids(!revealBids);
  };

  const handleSelectWinner = (bidderId) => {
    setSelectedWinner(bidderId);
  };

  const sortedBidders = [...activeBidders].sort((a, b) => b.bidAmount - a.bidAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Auctioneer Control Panel</h1>
              <p className="text-slate-400">Live Auction Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                auctionStatus === 'active' ? 'bg-green-500/20 border border-green-500/30' :
                auctionStatus === 'paused' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  auctionStatus === 'active' ? 'bg-green-400 animate-pulse' :
                  auctionStatus === 'paused' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}></div>
                <span className={`text-sm font-bold ${
                  auctionStatus === 'active' ? 'text-green-400' :
                  auctionStatus === 'paused' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {auctionStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Timer Section */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <h3 className="text-lg font-bold text-sky-400 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Auction Timer
            </h3>
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">
                {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
              </div>
              <div className="text-sky-400 text-sm font-medium mb-4">H : M : S</div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handlePauseResume}
                  disabled={auctionStatus === 'ended'}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    auctionStatus === 'ended'
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : auctionStatus === 'active'
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-white'
                      : 'bg-green-500 hover:bg-green-400 text-white'
                  }`}
                >
                  {auctionStatus === 'active' ? (
                    <><Pause className="w-4 h-4 inline mr-1" />Pause</>
                  ) : (
                    <><Play className="w-4 h-4 inline mr-1" />Resume</>
                  )}
                </button>
                <button
                  onClick={handleEndAuction}
                  disabled={auctionStatus === 'ended'}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    auctionStatus === 'ended'
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-400 text-white'
                  }`}
                >
                  <StopCircle className="w-4 h-4 inline mr-1" />
                  End
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <h3 className="text-lg font-bold text-sky-400 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Live Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Bidders:</span>
                <span className="text-white font-bold text-xl">{bidders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Active Bids:</span>
                <span className="text-green-400 font-bold text-xl">{activeBidders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Participation:</span>
                <span className="text-sky-400 font-bold text-xl">
                  {Math.round((activeBidders.length / bidders.length) * 100)}%
                </span>
              </div>
              {revealBids && (
                <>
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Highest Bid:</span>
                      <span className="text-green-400 font-bold text-xl">
                        ₹{highestBid.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Average Bid:</span>
                    <span className="text-sky-400 font-bold text-xl">
                      ₹{Math.round(averageBid).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Auction Info */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <h3 className="text-lg font-bold text-sky-400 mb-4 flex items-center">
              <Gavel className="w-5 h-5 mr-2" />
              Auction Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Item:</span>
                <span className="text-white font-semibold">Digital Asset</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Starting Bid:</span>
                <span className="text-white font-semibold">₹1,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Type:</span>
                <span className="text-sky-400 font-semibold">Sealed Bid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Auction ID:</span>
                <span className="text-white font-mono text-sm">#AUC-2024-001</span>
              </div>
              <div className="pt-3 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">
                    Quantum Secured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Reveal Control */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-sky-400" />
                  Sealed Bids Control
                </h3>
                <p className="text-slate-400 text-sm">
                  {revealBids 
                    ? 'All bid amounts are now visible to you' 
                    : 'Bids are currently encrypted and sealed'}
                </p>
              </div>
              <button
                onClick={handleRevealBids}
                disabled={auctionStatus !== 'ended' && activeBidders.length === 0}
                className={`py-3 px-6 rounded-xl font-bold transition-all ${
                  auctionStatus !== 'ended' && activeBidders.length === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : revealBids
                    ? 'bg-sky-500 hover:bg-sky-400 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                {revealBids ? (
                  <><EyeOff className="w-5 h-5 inline mr-2" />Hide Bids</>
                ) : (
                  <><Eye className="w-5 h-5 inline mr-2" />Reveal All Bids</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bidders List */}
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-sky-400 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Registered Bidders
            </h3>
            {revealBids && (
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Sorted by bid amount (highest first)</span>
              </div>
            )}
          </div>

          <div className="grid gap-3">
            {(revealBids ? sortedBidders : activeBidders).map((bidder, index) => (
              <div
                key={bidder.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedWinner === bidder.id
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {revealBids && index === 0 && (
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      bidder.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {bidder.name.charAt(bidder.name.indexOf(' ') + 1)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{bidder.name}</p>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className={bidder.status === 'active' ? 'text-green-400' : 'text-slate-400'}>
                          {bidder.status === 'active' ? '● Active' : '○ Waiting'}
                        </span>
                        {bidder.bidTime && (
                          <span className="text-slate-400">Bid at: {bidder.bidTime}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {revealBids ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ₹{bidder.bidAmount.toLocaleString('en-IN')}
                        </div>
                        {index === 0 && (
                          <span className="text-xs text-green-400 font-medium">Highest Bid</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sky-400">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Sealed</span>
                      </div>
                    )}

                    {revealBids && auctionStatus === 'ended' && (
                      <button
                        onClick={() => handleSelectWinner(bidder.id)}
                        className={`py-2 px-4 rounded-lg font-medium transition-all ${
                          selectedWinner === bidder.id
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {selectedWinner === bidder.id ? (
                          <><Trophy className="w-4 h-4 inline mr-1" />Winner</>
                        ) : (
                          'Select Winner'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!revealBids && bidders.filter(b => b.status === 'waiting').map(bidder => (
              <div
                key={bidder.id}
                className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-slate-600/20 text-slate-400">
                      {bidder.name.charAt(bidder.name.indexOf(' ') + 1)}
                    </div>
                    <div>
                      <p className="text-slate-300 font-semibold">{bidder.name}</p>
                      <span className="text-xs text-slate-400">○ Waiting</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-sm">No bid submitted</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Banner */}
        {auctionStatus === 'ended' && !selectedWinner && (
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Action Required</p>
                <p className="text-slate-300 text-sm">Please review the bids and select a winner to complete the auction.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctioneerLivePage;