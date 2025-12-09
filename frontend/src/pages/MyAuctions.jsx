import { useState } from 'react';
import { ArrowLeft, Filter, Search, Calendar, Clock, Gavel, PlayCircle } from 'lucide-react';

const MyAuctions = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock auction data with actual image URLs
  const auctions = {
    ongoing: [
      {
        id: 1,
        title: 'Vintage Rolex Submariner Watch',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop',
        startingBid: 120000,
        timeLeft: '2h 30m',
        status: 'active',
        hasParticipated: true
      },
      {
        id: 2,
        title: 'Classic BMW Motorcycle 1970',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
        startingBid: 250000,
        timeLeft: '1d 5h',
        status: 'active',
        hasParticipated: true
      },
      {
        id: 3,
        title: 'Antique Persian Carpet',
        image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=300&fit=crop',
        startingBid: 60000,
        timeLeft: '4h 15m',
        status: 'active',
        hasParticipated: false
      }
    ],
    upcoming: [
      {
        id: 4,
        title: 'Original Pablo Picasso Sketch',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop',
        startingBid: 350000,
        startTime: '2024-12-20 10:00 AM',
        status: 'scheduled'
      },
      {
        id: 5,
        title: 'Rare Diamond Necklace',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
        startingBid: 550000,
        startTime: '2024-12-22 2:00 PM',
        status: 'scheduled'
      }
    ]
  };

  const filteredAuctions = auctions[activeTab].filter(auction =>
    auction.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigateHome = () => {
    window.location.href = '/home';
  };

  const handleJoinAuction = (auctionId) => {
    window.location.href = '/live';
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
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-slate-800/50 rounded-xl p-1 mb-6 sm:mb-8 max-w-full sm:max-w-lg overflow-x-auto">
          {[
            { id: 'ongoing', label: 'Ongoing', icon: PlayCircle, count: auctions.ongoing.length },
            { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: auctions.upcoming.length }
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