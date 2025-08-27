import React, { useState, useEffect } from "react";
import AuctionItem from "../../components/live-auction/AuctionItem";
import AuctionDetails from "../../components/live-auction/AuctionDetails";
import BidForm from "../../components/live-auction/BidForm";
import BiddersList from "../../components/live-auction/BiddersList";
import AuctionStatusBar from "../../components/live-auction/AuctionStatusBar";
import ConfirmBidModal from "../../components/live-auction/ConfirmBidModal";
import Timer from "../../components/live-auction/Timer";


const LiveAuction = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  });
  const [bidAmount, setBidAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock bidders data
  const bidders = [
    { id: 1, name: "Anonymous Bidder #001", status: "active" },
    { id: 2, name: "Anonymous Bidder #007", status: "active" },
    { id: 3, name: "Anonymous Bidder #023", status: "active" },
    { id: 4, name: "Anonymous Bidder #045", status: "waiting" },
    { id: 5, name: "Anonymous Bidder #078", status: "active" },
    { id: 6, name: "Anonymous Bidder #091", status: "waiting" },
  ];

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
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
          hours: newHours >= 0 ? newHours : 0,
          minutes: newMinutes >= 0 ? newMinutes : 0,
          seconds: newSeconds >= 0 ? newSeconds : 0,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle bid submission
  const handleSubmitBid = () => {
    if (bidAmount && parseFloat(bidAmount) > 0) {
      setShowConfirmation(true);
    }
  };

  const confirmBid = () => {
    alert(`✅ Sealed bid of ₹${bidAmount} submitted successfully!`);
    setBidAmount("");
    setShowConfirmation(false);
  };

  const cancelBid = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-sky-400 mb-2">
            Live Auction
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white font-medium">Auction in Progress</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Side */}
          <div className="space-y-6">
            <AuctionItem />
            <AuctionDetails bidders={bidders} />
          </div>

          {/* Center - Bid Form */}
          <div className="space-y-6">
            <BidForm
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              handleSubmitBid={handleSubmitBid}
            />
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <BiddersList bidders={bidders} />
          </div>
        </div>
      </div>

      {/* Status Bar */}

      <AuctionStatusBar timeRemaining={timeRemaining} />
      

      {/* Confirmation Modal */}
      <ConfirmBidModal
        isOpen={showConfirmation}
        amount={bidAmount}
        onConfirm={confirmBid}
        onCancel={cancelBid}
      />
    </div>
  );
};

export default LiveAuction;
