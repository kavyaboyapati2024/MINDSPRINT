import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OngoingAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [timers, setTimers] = useState({});
  const [currentBidderId, setCurrentBidderId] = useState(null);
  const navigate = useNavigate();

  // Fetch current bidder
  useEffect(() => {
    const fetchCurrentBidder = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/bids/get-bidder-id", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch current bidder");
        const data = await res.json();
        setCurrentBidderId(data.userId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentBidder();
  }, []);

  // Fetch auctions once currentBidderId is available
  useEffect(() => {
    if (!currentBidderId) return;

    const fetchAuctions = async () => {
      try {
        const res = await fetch('http://localhost:9000/api/auctions/ongoing-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentBidderId })
        });
        const data = await res.json();
        setAuctions(data);

        // Initialize timers
        const initialTimers = {};
        data.forEach(auction => {
          const end = new Date(auction.endDateTime).getTime();
          const now = Date.now();
          const diff = Math.max(0, end - now);
          initialTimers[auction._id] = {
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          };
        });
        setTimers(initialTimers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAuctions();
  }, [currentBidderId]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = {};
        Object.keys(prev).forEach(id => {
          let { hours, minutes, seconds } = prev[id];
          if (hours === 0 && minutes === 0 && seconds === 0) {
            newTimers[id] = { hours: 0, minutes: 0, seconds: 0 };
          } else {
            seconds -= 1;
            if (seconds < 0) {
              seconds = 59;
              minutes -= 1;
            }
            if (minutes < 0) {
              minutes = 59;
              hours -= 1;
            }
            newTimers[id] = { hours, minutes, seconds };
          }
        });
        return newTimers;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timer) => {
    if (!timer) return '00:00:00';
    const { hours, minutes, seconds } = timer;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      LIVE: 'bg-red-500/20 text-red-300 border border-red-500/30',
      UPCOMING: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      COMPLETED: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    };
    const icons = { LIVE: '🔴', UPCOMING: '🕒', COMPLETED: '✅' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const ActionButton = ({ isRegistered, auctionId }) => {
    const type = isRegistered ? 'join' : 'watch';
    const styles = {
      join: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
      watch: 'bg-gray-600/50 hover:bg-gray-700 text-white'
    };
    const icons = { join: <Play className="w-3 h-3" />, watch: <Eye className="w-3 h-3" /> };
    const labels = { join: 'Join', watch: 'Watch' };

    const handleClick = () => {
      // Navigate to live auction page
      navigate(`/live/${auctionId}`);
    };

    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg ${styles[type]}`}
      >
        {icons[type]}
        {labels[type]}
      </button>
    );
  };

  const getStatus = (endDateTime) => {
    return new Date() > new Date(endDateTime) ? 'COMPLETED' : 'LIVE';
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-7 gap-3 font-semibold text-white">
        <div className="col-span-2">Auction Title</div>
        <div className="col-span-1">Auctioneer</div>
        <div className="col-span-1">End Time</div>
        <div className="col-span-1">Sealed Bids</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Action</div>
      </div>
      {auctions.map((auction) => (
        <div
          key={auction._id}
          className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
        >
          <div className="grid grid-cols-7 gap-3 items-center">
            <div className="col-span-2 font-semibold text-slate-200">{auction.title}</div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
              <User className="w-3 h-3" /> {auction.auctionerName}
            </div>
            <div className="col-span-1 font-mono font-semibold text-amber-400 text-sm">
              {formatTime(timers[auction._id])}
            </div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3" /> <span className="text-xs font-semibold">Locked</span>
            </div>
            <div className="col-span-1">
              <StatusBadge status={getStatus(auction.endDateTime)} />
            </div>
            <div className="col-span-1">
              <ActionButton isRegistered={auction.isRegistered} auctionId={auction._id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OngoingAuctions;
