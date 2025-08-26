import React, { useState } from 'react';
import { User, Calendar, UserPlus } from 'lucide-react';
import AuctionRegistrationForm from './AuctionRegistrationForm';

const UpcomingAuctions = ({
  registeredAuctions = new Set(), // ✅ always a Set
  userId = null
}) => {
  const [selectedAuction, setSelectedAuction] = useState(null);

  // ✅ registration check
  const isRegisteredFn = (title) => {
    if (!registeredAuctions) return false;
    if (typeof registeredAuctions.has === 'function') return registeredAuctions.has(title);
    if (Array.isArray(registeredAuctions)) return registeredAuctions.includes(title);
    return false;
  };

  // ✅ simplified: only opens modal
  const openRegistrationModal = (auction) => {
    setSelectedAuction(auction);
  };

  const closeRegistrationModal = () => setSelectedAuction(null);

  const ActionButton = ({ type, onClick, isRegistered = false }) => {
    const styles = {
      register: isRegistered
        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed'
        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
    };

    const icons = { register: <UserPlus className="w-3 h-3" /> };
    const labels = { register: isRegistered ? 'Registered' : 'Register' };

    return (
      <button
        onClick={isRegistered ? undefined : onClick}
        disabled={isRegistered}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 ${
          !isRegistered ? 'hover:transform hover:scale-105 hover:shadow-lg' : ''
        } ${styles[type]}`}
      >
        {icons[type]}
        {labels[type]}
      </button>
    );
  };

  // Dummy auctions
  const upcomingAuctions = [
    {
      title: 'Vehicle Fleet Auction',
      auctioneer: 'Robert Davis',
      purpose: 'Transportation Services',
      startTime: 'Dec 28, 2024 - 10:00 AM',
      endTime: 'Dec 28, 2024 - 06:00 PM',
      status: 'UPCOMING'
    },
    {
      title: 'Medical Equipment Procurement',
      auctioneer: 'Dr. Emily Brown',
      purpose: 'Hospital Equipment',
      startTime: 'Dec 30, 2024 - 09:00 AM',
      endTime: 'Dec 30, 2024 - 05:00 PM',
      status: 'UPCOMING'
    },
    {
      title: 'Construction Materials Bid',
      auctioneer: 'David Wilson',
      purpose: 'Infrastructure Development',
      startTime: 'Jan 02, 2025 - 11:00 AM',
      endTime: 'Jan 02, 2025 - 07:00 PM',
      status: 'UPCOMING'
    }
  ];

  return (
    <>
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-7 gap-3 font-semibold text-white">
          <div className="col-span-2">Auction Title</div>
          <div className="col-span-1">Auctioneer</div>
          <div className="col-span-1">Purpose</div>
          <div className="col-span-1">Start Time</div>
          <div className="col-span-1">End Time</div>
          <div className="col-span-1">Action</div>
        </div>

        {upcomingAuctions.map((auction, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
          >
            <div className="grid grid-cols-7 gap-3 items-center">
              <div className="col-span-2 font-semibold text-slate-200">
                {auction?.title ?? 'Untitled Auction'}
              </div>
              <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                <User className="w-3 h-3" />
                {auction?.auctioneer ?? '—'}
              </div>
              <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {auction?.purpose ?? '—'}
              </div>
              <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{auction?.startTime ?? '—'}</span>
              </div>
              <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{auction?.endTime ?? '—'}</span>
              </div>
              <div className="col-span-1">
                <ActionButton
                  type="register"
                  onClick={() => openRegistrationModal(auction)}
                  isRegistered={isRegisteredFn(auction?.title)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Always use external AuctionRegistrationForm */}
      {selectedAuction && (
        <AuctionRegistrationForm
          auction={selectedAuction}
          onClose={closeRegistrationModal}
          userId={userId}
        />
      )}
    </>
  );
};

export default UpcomingAuctions;
