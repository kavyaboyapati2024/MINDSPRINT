import React, { useState, useEffect } from 'react';
import { TrendingUp, User, Clock, Calendar, CheckCircle, Play, UserPlus, Download, Lock } from 'lucide-react';

const AuctionHomepage = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registeredAuctions, setRegisteredAuctions] = useState(new Set());
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [timers, setTimers] = useState({
    'laptop': { hours: 2, minutes: 28, seconds: 0 },
    'furniture': { hours: 4, minutes: 55, seconds: 15 },
    'software': { hours: 1, minutes: 12, seconds: 45 }
  });

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach(key => {
          let { hours, minutes, seconds } = newTimers[key];
          seconds--;
          if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
              minutes = 59;
              hours--;
              if (hours < 0) {
                newTimers[key] = { hours: 0, minutes: 0, seconds: 0 };
                return;
              }
            }
          }
          newTimers[key] = { hours, minutes, seconds };
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timer) => {
    const { hours, minutes, seconds } = timer;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

  const completedAuctions = [
    {
      title: 'Server Hardware Auction',
      auctioneer: 'Tech Solutions Inc.',
      purpose: 'Data Center Setup',
      completionDate: 'Dec 20, 2024',
      winningBid: '₹8,75,000',
      status: 'COMPLETED'
    },
    {
      title: 'Marketing Services Bid',
      auctioneer: 'Creative Agency Ltd.',
      purpose: 'Brand Promotion',
      completionDate: 'Dec 18, 2024',
      winningBid: '₹2,50,000',
      status: 'COMPLETED'
    },
    {
      title: 'Catering Contract Auction',
      auctioneer: 'Food Services Co.',
      purpose: 'Employee Meals',
      completionDate: 'Dec 15, 2024',
      winningBid: '₹4,20,000',
      status: 'COMPLETED'
    }
  ];

  const TabButton = ({ tab, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 transform -translate-y-1'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
      }`}
    >
      {icon}
      {label}
    </button>
  );

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

  const ActionButton = ({ type, onClick, isRegistered = false }) => {
    const styles = {
      join: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
      register: isRegistered 
        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed' 
        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white',
      report: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white'
    };

    const icons = {
      join: <Play className="w-3 h-3" />,
      register: <UserPlus className="w-3 h-3" />,
      report: <Download className="w-3 h-3" />
    };

    const labels = {
      join: 'Watch',
      register: isRegistered ? 'Registered' : 'Register',
      report: 'Report'
    };

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

  const handleRegister = (auction) => {
    setSelectedAuction(auction);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Add auction to registered list
    setRegisteredAuctions(prev => new Set([...prev, selectedAuction.title]));
    setShowRegistrationModal(false);
    setShowSuccessMessage(true);
    
    // Clear form
    setRegistrationData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Quantum Bid
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            Experience the future of professional auctions with our cutting-edge platform. 
            Secure, transparent, and trusted by industry leaders worldwide.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:transform hover:scale-105 transition-all duration-300">
              <TrendingUp className="w-5 h-5" />
              Explore Live Auctions
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">$2.5B+</div>
              <div className="text-slate-400 font-medium text-sm">Total Auction Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">15,000+</div>
              <div className="text-slate-400 font-medium text-sm">Successful Auctions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">500+</div>
              <div className="text-slate-400 font-medium text-sm">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">🛡️ 99.9%</div>
              <div className="text-slate-400 font-medium text-sm">Security Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Tables Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-2 mb-8">
          <TabButton
            tab="ongoing"
            label="Ongoing"
            icon={<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/60"></div>}
            isActive={activeTab === 'ongoing'}
            onClick={setActiveTab}
          />
          <TabButton
            tab="upcoming"
            label="Upcoming"
            icon={<div className="w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/60"></div>}
            isActive={activeTab === 'upcoming'}
            onClick={setActiveTab}
          />
          <TabButton
            tab="completed"
            label="Completed"
            icon={<div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/60"></div>}
            isActive={activeTab === 'completed'}
            onClick={setActiveTab}
          />
        </div>

        {/* Ongoing Auctions */}
        {activeTab === 'ongoing' && (
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
        )}

        {/* Upcoming Auctions */}
        {activeTab === 'upcoming' && (
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
                  <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{auction.startTime}</span>
                  </div>
                  <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{auction.endTime}</span>
                  </div>
                  <div className="col-span-1">
                    <ActionButton 
                      type="register" 
                      onClick={() => handleRegister(auction)}
                      isRegistered={registeredAuctions.has(auction.title)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Auctions */}
        {activeTab === 'completed' && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-7 gap-3 font-semibold text-white">
              <div className="col-span-2">Auction Title</div>
              <div className="col-span-1">Auctioneer</div>
              <div className="col-span-1">Purpose</div>
              <div className="col-span-1">Completion Date</div>
              <div className="col-span-1">Winning Bid</div>
              <div className="col-span-1">Action</div>
            </div>
            {completedAuctions.map((auction, index) => (
              <div
                key={index}
                className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
              >
                <div className="grid grid-cols-7 gap-3 items-center">
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
                  <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{auction.completionDate}</span>
                  </div>
                  <div className="col-span-1 font-bold text-emerald-400">
                    {auction.winningBid}
                  </div>
                  <div className="col-span-1">
                    <ActionButton type="report" onClick={() => console.log('Download report')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Register for Auction</h3>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">✕</div>
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm font-semibold">{selectedAuction?.title}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={registrationData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                <textarea
                  name="address"
                  value={registrationData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRegistrationSubmit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg border border-emerald-400/30 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Successfully registered for the auction!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionHomepage;