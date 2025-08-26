import React, { useState, useEffect } from 'react';
import { Clock, Users, Shield, Lock, Eye, IndianRupee, Timer, Gavel } from 'lucide-react';

const LiveAuction = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });
  const [bidAmount, setBidAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock bidders data
  const bidders = [
    { id: 1, name: 'Anonymous Bidder #001', status: 'active' },
    { id: 2, name: 'Anonymous Bidder #007', status: 'active' },
    { id: 3, name: 'Anonymous Bidder #023', status: 'active' },
    { id: 4, name: 'Anonymous Bidder #045', status: 'waiting' },
    { id: 5, name: 'Anonymous Bidder #078', status: 'active' },
    { id: 6, name: 'Anonymous Bidder #091', status: 'waiting' }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitBid = () => {
    if (bidAmount && parseFloat(bidAmount) > 0) {
      setShowConfirmation(true);
    }
  };

  const confirmBid = () => {
    alert(`Sealed bid of ₹${bidAmount} submitted successfully!`);
    setBidAmount('');
    setShowConfirmation(false);
  };

  const cancelBid = () => {
    setShowConfirmation(false);
  };

  const formatTime = (num) => num.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-emerald-500/6 to-teal-500/6 rounded-full blur-2xl"></div>
        
        {/* Mouse-following gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-sky-400/5 to-purple-400/5 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-sky-400 mb-2">Live Auction</h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white font-medium">Auction in Progress</span>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Left Column - Auction Item */}
          <div className="space-y-6">
            {/* Auction Item Image */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center border border-slate-600/50">
                <div className="text-center">
                  <Gavel className="w-16 h-16 text-sky-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg font-medium">Premium Digital Asset</p>
                  <p className="text-slate-400 text-sm mt-2">High Resolution Image</p>
                </div>
              </div>
            </div>

            {/* Auction Details */}
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
                    <span className="text-green-400 font-semibold text-sm">Quantum Secured</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-sm">
                    <Lock className="w-4 h-4 text-sky-400" />
                    <span className="text-slate-300">All bids are encrypted and sealed until auction ends</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Timer and Bid Submission */}
          <div className="space-y-6">
            {/* Timer */}
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
                      cx="50%" 
                      cy="50%" 
                      r="90" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                      className="text-sky-500/30"
                    />
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r="90" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 90}`}
                      strokeDashoffset={`${2 * Math.PI * 90 * 0.3}`}
                      className="text-sky-400 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bid Submission */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
              <h3 className="text-lg font-bold text-sky-400 mb-4 text-center">Place Your Sealed Bid</h3>
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
                  <p className="text-xs text-slate-400 mt-1">Minimum bid: ₹1,00,000.00</p>
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span className="text-sky-400 text-sm font-medium">Sealed Bid Protection</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Your bid amount will remain completely confidential and encrypted until the auction ends. 
                    No other bidders can see your bid.
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
          </div>

          {/* Right Column - Bidders List */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-sky-400">Active Bidders</h3>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-sky-400" />
                <span className="text-sky-400 font-semibold">{bidders.filter(b => b.status === 'active').length}</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bidders.map((bidder) => (
                <div 
                  key={bidder.id} 
                  className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${bidder.status === 'active' ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                    <div>
                      <p className="text-white text-sm font-medium">{bidder.name}</p>
                      <p className={`text-xs ${bidder.status === 'active' ? 'text-green-400' : 'text-slate-400'}`}>
                        {bidder.status === 'active' ? 'Active' : 'Waiting'}
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
                  <span className="text-sky-400 text-sm font-medium">Privacy Protected</span>
                </div>
                <p className="text-xs text-slate-300">
                  All bid amounts remain confidential until auction completion. 
                  Bidder identities are anonymized for fair competition.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
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
            <div className="text-slate-400 text-sm">
              Auction ID: #AUC-2024-001
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-sky-500/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-md w-full relative overflow-hidden">
            {/* Modal background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-purple-500/5 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                
                <h3 className="text-xl font-bold text-white mb-2">Confirm Your Bid</h3>
                <p className="text-slate-300 text-sm">
                  Are you sure you want to submit your sealed bid?
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Your Bid Amount:</span>
                  <span className="text-white font-bold text-lg">₹{parseFloat(bidAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Lock className="w-3 h-3" />
                  <span>This bid will be encrypted and sealed until auction ends</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-black font-bold text-xs">!</span>
                  </div>
                  <div className="text-xs text-yellow-200">
                    <p className="font-medium mb-1">Important:</p>
                    <p>Once submitted, your bid cannot be modified or withdrawn. Please ensure the amount is correct.</p>
                  </div>
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
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]"
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
      )}
    </div>
  );
};

export default LiveAuction;