import React from 'react';
import { User, Play, Lock } from 'lucide-react';

const OngoingAuctions = ({ timers }) => {
  const formatTime = (timer) => {
    const { hours, minutes, seconds } = timer;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      LIVE: 'bg-red-500/20 text-red-300 border border-red-500/30',
      UPCOMING: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      COMPLETED: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    };

    const icons = {
      LIVE: '🔴',
      UPCOMING: '🕒',
      COMPLETED: '✅'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const ActionButton = ({ type, onClick }) => {
    const styles = {
      join: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
    };

    const icons = {
      join: <Play className="w-3 h-3" />
    };

    const labels = {
      join: 'Watch'
    };

    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg ${styles[type]}`}
      >
        {icons[type]}
        {labels[type]}
      </button>
    );
  };

  const ongoingAuctions = [
    {
      id: 'laptop',
      title: 'Laptop Procurement Auction',
      auctioneer: 'John Smith',
      purpose: 'Office Equipment Purchase',
      endTime: timers.laptop,
      currentBid: '₹85,000',
      status: 'LIVE'
    },
    {
      id: 'furniture',
      title: 'Office Furniture Bidding',
      auctioneer: 'Sarah Wilson',
      purpose: 'Workspace Setup',
      endTime: timers.furniture,
      currentBid: '₹1,25,000',
      status: 'LIVE'
    },
    {
      id: 'software',
      title: 'Software License Auction',
      auctioneer: 'Mike Johnson',
      purpose: 'IT Infrastructure',
      endTime: timers.software,
      currentBid: '₹3,50,000',
      status: 'LIVE'
    }
  ];

  return (
    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-8 gap-3 font-semibold text-white">
        <div className="col-span-2">Auction Title</div>
        <div className="col-span-1">Auctioneer</div>
        <div className="col-span-1">Purpose</div>
        <div className="col-span-1">End Time</div>
        <div className="col-span-1">Sealed Bids</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Action</div>
      </div>
      {ongoingAuctions.map((auction, index) => (
        <div
          key={index}
          className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
        >
          <div className="grid grid-cols-8 gap-3 items-center">
            <div className="col-span-2 font-semibold text-slate-200">
              {auction.title}
            </div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
              <User className="w-3 h-3" />
              {auction.auctioneer}
            </div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {auction.purpose}
            </div>
            <div className="col-span-1 font-mono font-semibold text-amber-400 text-sm">
              {formatTime(auction.endTime)}
            </div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3" />
              <span className="text-xs font-semibold">Locked</span>
            </div>
            <div className="col-span-1">
              <StatusBadge status={auction.status} />
            </div>
            <div className="col-span-1">
              <ActionButton type="join" onClick={() => console.log('Join auction')} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OngoingAuctions;