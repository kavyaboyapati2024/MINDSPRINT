
import { useState, useEffect } from 'react';
import { Clock, Users, Shield, Lock, Eye, IndianRupee, Timer, Gavel, Trophy, Star, UserCheck, UserX, AlertCircle } from 'lucide-react';

const ViewLiveAuction = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 10
  });
  const [bidAmount, setBidAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState(null);
  
  // New state for registration status
  const [isRegistered, setIsRegistered] = useState(false); // Set to false to simulate non-registered user
  const [userStatus, setUserStatus] = useState('viewer'); // 'registered', 'viewer', 'pending'

  // Mock bidders data with bid amounts and encrypted representations
  const bidders = [
    { id: 1, name: 'Bidder #001', bidAmount: 250000, encryptedBid: 'E7A9F2B4C8D1' },
    { id: 2, name: 'Bidder #007', bidAmount: 180000, encryptedBid: 'B3E8A1F5D9C2' },
    { id: 3, name: 'Bidder #023', bidAmount: 320000, encryptedBid: 'F1D4B7E2A9C6' },
    { id: 4, name: 'Bidder #045', bidAmount: 195000, encryptedBid: 'C8F2D5A1B4E7' },
    { id: 5, name: 'Bidder #078', bidAmount: 275000, encryptedBid: 'A6C9F3B8E1D4' },
    { id: 6, name: 'Bidder #091', bidAmount: 210000, encryptedBid: 'D2B5F8C1A7E3' }
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
    if (auctionEnded) return;

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

        // Check if time has reached zero
        if (newHours <= 0 && newMinutes <= 0 && newSeconds <= 0) {
          setAuctionEnded(true);
          // Determine winner
          const winningBidder = bidders.reduce((prev, current) => 
            (prev.bidAmount > current.bidAmount) ? prev : current
          );
          setWinner(winningBidder);
          setTimeout(() => setShowWinnerModal(true), 1000);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionEnded]);

  const handleSubmitBid = () => {
    if (bidAmount && parseFloat(bidAmount) > 0 && !auctionEnded && isRegistered) {
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

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
  };

  const getStatusColor = () => {
    if (userStatus === 'registered') return 'text-green-400';
    if (userStatus === 'pending') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = () => {
    if (userStatus === 'registered') return <UserCheck className="w-4 h-4" />;
    if (userStatus === 'pending') return <Clock className="w-4 h-4" />;
    return <UserX className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (userStatus === 'registered') return 'Registered Bidder';
    if (userStatus === 'pending') return 'Registration Pending';
    return 'Viewer Only';
  };

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
        {/* Header with User Status */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-sky-400 mb-2">Live Auction</h1>
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${auctionEnded ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span className="text-white font-medium">
                {auctionEnded ? 'Auction Ended' : 'Auction in Progress'}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
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
                {auctionEnded && winner && (
                  <div className="flex justify-between">
                    <span className="text-slate-300">Winning Bid:</span>
                    <span className="text-green-400 font-bold">₹{winner.bidAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
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
                    <span className="text-slate-300">
                      {auctionEnded ? 'All bids have been revealed' : 'All bids are encrypted and sealed until auction ends'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Timer and Bid Submission */}
          <div className="space-y-6">
            {/* Timer */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-8 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)] text-center">
              <h3 className="text-lg font-bold text-sky-400 mb-6">
                {auctionEnded ? 'Auction Completed' : 'Time Remaining'}
              </h3>
              <div className="relative">
                <div className={`w-48 h-48 mx-auto border-4 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-700/50 ${
                  auctionEnded ? 'border-red-500' : 'border-sky-500'
                }`}>
                  <div className="text-center">
                    {auctionEnded ? (
                      <div>
                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-black text-yellow-400 mb-1">ENDED</div>
                        <div className="text-sky-400 text-sm font-medium">Winner Declared</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl font-black text-white mb-2">
                          {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
                        </div>
                        <div className="text-sky-400 text-sm font-medium">H : M : S</div>
                      </div>
                    )}
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
                      className={auctionEnded ? 'text-red-500/30' : 'text-sky-500/30'}
                    />
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r="90" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 90}`}
                      strokeDashoffset={auctionEnded ? `${2 * Math.PI * 90}` : `${2 * Math.PI * 90 * 0.3}`}
                      className={auctionEnded ? 'text-red-400' : 'text-sky-400'}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bid Submission */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
              <h3 className="text-lg font-bold text-sky-400 mb-4 text-center">
                {auctionEnded ? 'Bidding Closed' : isRegistered ? 'Place Your Sealed Bid' : 'Bidding (Registration Required)'}
              </h3>
              
              {/* Registration Required Notice */}
              {!isRegistered && !auctionEnded && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <UserX className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-orange-300 font-semibold text-sm">Registration Required</p>
                      <p className="text-orange-200 text-xs mt-1">Complete registration to participate in bidding</p>
                    </div>
                  </div>
                </div>
              )}

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
                      disabled={auctionEnded || !isRegistered}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-white placeholder-slate-400 transition-all duration-300 ${
                        auctionEnded || !isRegistered
                          ? 'bg-slate-700/50 border-slate-600/50 cursor-not-allowed' 
                          : 'bg-slate-800/80 border-slate-600/50 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                      }`}
                      placeholder={
                        auctionEnded 
                          ? "Auction has ended" 
                          : !isRegistered 
                            ? "Registration required" 
                            : "Enter your bid amount"
                      }
                      min="100000"
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {auctionEnded 
                      ? 'No more bids accepted' 
                      : !isRegistered 
                        ? 'Please register to place bids' 
                        : 'Minimum bid: ₹1,00,000.00'
                    }
                  </p>
                </div>
                
                <div className={`rounded-lg p-3 border ${
                  auctionEnded 
                    ? 'bg-red-800/20 border-red-600/30' 
                    : !isRegistered
                      ? 'bg-orange-800/20 border-orange-600/30'
                      : 'bg-slate-800/30 border-slate-600/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {auctionEnded ? (
                      <>
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Auction Completed</span>
                      </>
                    ) : !isRegistered ? (
                      <>
                        <UserX className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 text-sm font-medium">Registration Required</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-sky-400" />
                        <span className="text-sky-400 text-sm font-medium">Sealed Bid Protection</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    {auctionEnded 
                      ? 'The auction has ended and the winner has been determined based on the highest sealed bid.'
                      : !isRegistered
                        ? 'You are currently viewing this auction as a guest. Complete registration to participate in bidding and place sealed bids.'
                        : 'Your bid amount will remain completely confidential and encrypted until the auction ends. No other bidders can see your bid.'
                    }
                  </p>
                </div>

                <button
                  onClick={handleSubmitBid}
                  disabled={auctionEnded || !isRegistered}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 ${
                    auctionEnded || !isRegistered
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {auctionEnded ? (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Bidding Closed
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Submit Sealed Bid
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Bidders List */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-sky-400">
                {auctionEnded ? 'Final Results' : 'Registered Bidders'}
              </h3>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-sky-400" />
                <span className="text-sky-400 font-semibold">{bidders.length}</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bidders
                .sort((a, b) => auctionEnded ? b.bidAmount - a.bidAmount : 0)
                .map((bidder, index) => (
                <div 
                  key={bidder.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    auctionEnded && winner && bidder.id === winner.id 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                      : 'bg-slate-800/40 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {auctionEnded && winner && bidder.id === winner.id && (
                      <Trophy className="w-4 h-4 text-yellow-400" />
                    )}
                    <div className={`w-3 h-3 rounded-full ${
                      auctionEnded && winner && bidder.id === winner.id 
                        ? 'bg-yellow-400' 
                        : 'bg-green-400'
                    }`}></div>
                    <div>
                      <p className={`text-sm font-medium ${
                        auctionEnded && winner && bidder.id === winner.id ? 'text-yellow-300' : 'text-white'
                      }`}>
                        {bidder.name}
                        {auctionEnded && winner && bidder.id === winner.id && (
                          <span className="ml-2 text-xs font-bold text-yellow-400">WINNER</span>
                        )}
                      </p>
                      <p className={`text-xs ${
                        auctionEnded && winner && bidder.id === winner.id 
                          ? 'text-yellow-400' 
                          : 'text-green-400'
                      }`}>
                        {auctionEnded && winner && bidder.id === winner.id 
                          ? 'Winner' 
                          : 'Registered Bidder'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {auctionEnded ? (
                      <div className="text-sm font-semibold text-white">
                        ₹{bidder.bidAmount.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-mono">
                          {bidder.encryptedBid}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className={`rounded-lg p-3 ${
                auctionEnded ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-800/30'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {auctionEnded ? (
                    <>
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">Results Published</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-sky-400" />
                      <span className="text-sky-400 text-sm font-medium">Privacy Protected</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {auctionEnded 
                    ? 'All bid amounts have been revealed and ranked. The highest bidder has been declared the winner.'
                    : 'All bid amounts remain confidential until auction completion. Only registered bidders can participate in sealed bidding.'
                  }
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
                <div className={`w-2 h-2 rounded-full ${auctionEnded ? 'bg-red-400' : 'bg-green-400'}`}></div>
                <span className="text-slate-300 text-sm">
                  {auctionEnded ? 'Auction Completed' : 'Auction Active'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="text-slate-300 text-sm">Quantum Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="text-slate-300 text-sm">Real-time Updates</span>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm">{getStatusText()}</span>
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

      {/* Winner Announcement Modal */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 bg-slate/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border border-yellow-500/50 shadow-[0_0_80px_rgba(0,0,0,0.9)] max-w-lg w-full relative overflow-hidden">
            
            
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-yellow-400 mb-2">WINNER</h2>
                <p className="text-slate-300 text-lg">Congratulations to the auction winner!</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 mb-6 border border-yellow-500/30">
                <div className="mb-4">
                  <p className="text-yellow-300 text-sm font-medium mb-1">Winning Bidder</p>
                  <p className="text-2xl font-bold text-white">{winner.name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-yellow-300 text-sm font-medium mb-1">Winning Bid Amount</p>
                  <p className="text-3xl font-black text-green-400">₹{winner.bidAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <span className="text-slate-300">Verified & Secured Transaction</span>
                </div>
              </div>

              

              <div className="flex space-x-3">
                <button
                  onClick={closeWinnerModal}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]"
                >
                  <span className="flex items-center justify-center">
                    View Final Results
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

export default ViewLiveAuction;