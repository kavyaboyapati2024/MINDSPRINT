import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Search, Calendar, Clock, Gavel, PlayCircle } from 'lucide-react';
import AuthService from '../services/authServices';

const MyAuctions = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [searchTerm, setSearchTerm] = useState('');
  const [auctions, setAuctions] = useState({ ongoing: [], upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  // Helper: pretty time-left string
  const formatTimeLeft = (end) => {
    try {
      const now = new Date();
      const endDt = new Date(end);
      const diffMs = endDt - now;
      if (diffMs <= 0) return 'Ended';
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
      if (diffDays > 0) return `${diffDays}d ${diffHrs}h`;
      if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
      return `${diffMins}m`;
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchMyAuctions = async () => {
      setLoading(true);
      const user = AuthService.getCurrentUser();
      try {
        let resJson = { auctions: [] };
        if (user && user._id) {
          const res = await fetch(`http://localhost:9000/api/auctions/by-bidder/${user._id}`);
          if (res.ok) resJson = await res.json();
        }

        // normalize auctions array from { auctions: [...] }
        const auctionsFromApi = Array.isArray(resJson) ? resJson : (resJson && resJson.auctions) ? resJson.auctions : [];

        // If not logged in or endpoint returned nothing, fallback to public endpoints
        if (!auctionsFromApi || (Array.isArray(auctionsFromApi) && auctionsFromApi.length === 0)) {
          const [ongoingRes, upcomingRes] = await Promise.all([
            fetch('http://localhost:9000/api/auctions/ongoing'),
            fetch('http://localhost:9000/api/auctions/upcoming')
          ]);
          const ongoingJson = ongoingRes.ok ? await ongoingRes.json() : [];
          const upcomingJson = upcomingRes.ok ? await upcomingRes.json() : [];

          // backend returns { ongoing: [...] } and { upcoming: [...] }
          const ongoingArr = Array.isArray(ongoingJson) ? ongoingJson : (ongoingJson && Array.isArray(ongoingJson.ongoing) ? ongoingJson.ongoing : []);
          const upcomingArr = Array.isArray(upcomingJson) ? upcomingJson : (upcomingJson && Array.isArray(upcomingJson.upcoming) ? upcomingJson.upcoming : []);

          if (!mounted) return;
          setAuctions({
            ongoing: (ongoingArr || []).map((a) => ({
              id: a._id || a.id,
              title: a.title || a.name || a.item?.title,
              image: a.imageUrl || `http://localhost:9000/api/auctions/${a._id || a.id}/image`,
              startingBid: a.basePrice || a.startingBid || 0,
              timeLeft: formatTimeLeft(a.endDateTime || a.endAt || a.end),
              status: 'ongoing',
              hasParticipated: false
            })),
            upcoming: (upcomingArr || []).map((a) => ({
              id: a._id || a.id,
              title: a.title || a.name || a.item?.title,
              image: a.imageUrl || `http://localhost:9000/api/auctions/${a._id || a.id}/image`,
              startingBid: a.basePrice || a.startingBid || 0,
              startTime: a.startDateTime || a.startAt || a.start,
              status: 'upcoming'
            })),
            past: []
          });
          setLoading(false);
          return;
        }

        // If we got bidder-specific auctions, split into ongoing/upcoming/past
        const now = new Date();
        const ongoing = [];
        const upcoming = [];
        const past = [];
        (auctionsFromApi || []).forEach((a) => {
          const start = a.startDateTime ? new Date(a.startDateTime) : a.start ? new Date(a.start) : null;
          const end = a.endDateTime ? new Date(a.endDateTime) : a.end ? new Date(a.end) : null;

          // prefer server-provided status when available
          const statusFromServer = (a.status || '').toString().toLowerCase();
          const status = statusFromServer;

          const mapped = {
            id: a._id || a.id,
            title: a.title || a.name || a.item?.title,
            image: a.imageUrl || `http://localhost:9000/api/auctions/${a._id || a.id}/image`,
            startingBid: a.basePrice || a.startingBid || 0,
            timeLeft: end ? formatTimeLeft(end) : '',
            startTime: start ? start.toLocaleString() : null,
            status,
            hasParticipated: true
          };

          if (status === 'past') past.push(mapped);
          else if (status === 'upcoming') upcoming.push(mapped);
          else ongoing.push(mapped);
        });

        if (!mounted) return;
        setAuctions({ ongoing, upcoming, past });
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMyAuctions();

    return () => { mounted = false; };
  }, []);

  const filteredAuctions = (auctions[activeTab] || []).filter(auction =>
    (auction.title || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigateHome = () => {
    window.location.href = '/home';
  };

  const handleJoinAuction = (auctionId) => {
    window.location.href = `/live/${auctionId}`;
  };

  const renderOngoingAuction = (auction) => (
    <div key={auction.id} className="bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-sky-500/30 hover:border-sky-400/50 transition-all">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-800">
        <img 
          src={auction.image} 
          alt={auction.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">LIVE</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-white font-semibold text-base md:text-lg mb-2">{auction.title}</h3>
          <div className="text-sm text-slate-400">
            <span>Auction in progress</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-1">Base Amount</p>
          <p className="text-white font-bold text-lg md:text-xl">₹{auction.startingBid.toLocaleString('en-IN')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 text-orange-400">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">{auction.timeLeft} left</span>
          </div>
          <button 
            onClick={() => handleJoinAuction(auction.id)}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg hover:shadow-sky-500/50"
          >
            Join Auction
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpcomingAuction = (auction) => (
    <div key={auction.id} className="bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-sky-500/30 hover:border-sky-400/50 transition-all">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-800">
        <img 
          src={auction.image} 
          alt={auction.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">UPCOMING</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-white font-semibold text-base md:text-lg mb-2">{auction.title}</h3>
          <div className="text-sm text-slate-400">
            <span>Scheduled auction</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-1">Base Amount</p>
          <p className="text-white font-bold text-lg md:text-xl">₹{auction.startingBid.toLocaleString('en-IN')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-sm">{auction.startTime}</span>
          </div>
          <button 
            disabled
            className="w-full sm:w-auto bg-slate-700 text-slate-400 px-8 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed"
          >
            Not Started
          </button>
        </div>
      </div>
    </div>
  );

  const renderPastAuction = (auction) => (
    <div key={auction.id} className="bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/30 hover:border-slate-600/50 transition-all">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-800">
        <img 
          src={auction.image} 
          alt={auction.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-slate-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">COMPLETED</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-white font-semibold text-base md:text-lg mb-2">{auction.title}</h3>
          <div className="text-sm text-slate-400">
            <span>Completed auction</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-1">Base Amount</p>
          <p className="text-white font-bold text-lg md:text-xl">₹{(auction.startingBid || 0).toLocaleString('en-IN')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-medium text-sm">{auction.startTime}</span>
          </div>
          <button 
            onClick={() => window.location.href = `/auction/${auction.id}`}
            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleNavigateHome}
                className="bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm text-white p-2 rounded-lg border border-sky-500/30 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">My Auctions</h1>
                <p className="text-slate-400 text-sm sm:text-base">Track all your auction activities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 focus:border-sky-400 focus:outline-none w-full sm:w-64"
                />
              </div>
              <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-600 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-800/50 rounded-xl p-1 mb-6 sm:mb-8 max-w-full overflow-x-auto">
          {[
            { id: 'ongoing', label: 'Ongoing', icon: PlayCircle, count: auctions.ongoing.length },
            { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: auctions.upcoming.length },
            { id: 'past', label: 'Completed', icon: Gavel, count: auctions.past.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              <span className="bg-slate-600 text-xs px-2 py-1 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.length > 0 ? (
            <>
              {activeTab === 'ongoing' && filteredAuctions.map(renderOngoingAuction)}
              {activeTab === 'upcoming' && filteredAuctions.map(renderUpcomingAuction)}
              {activeTab === 'past' && filteredAuctions.map(renderPastAuction)}
            </>
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No auctions found</h3>
              <p className="text-slate-400">
                {searchTerm ? 'Try adjusting your search terms' : `You haven't participated in any ${activeTab} auctions yet`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAuctions;
