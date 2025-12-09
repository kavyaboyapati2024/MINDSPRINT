import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, Filter, Edit2, Trash2, Calendar, Clock, DollarSign, FileText, Eye, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuctionReportModal from '../../components/auction/AuctionReportModal';

const AuctioneerDashboard = () => {
    const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [auctioneerName, setAuctioneerName] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportAuctionId, setReportAuctionId] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Dummy data with proper image URLs
  const dummyAuctions = [
    {
      _id: '1',
      title: 'Vintage Rolex Submariner Watch',
      description: 'Rare 1960s Rolex Submariner in excellent condition with original box and papers.',
      basePrice: 15000,
      startDateTime: '2025-12-15T10:00:00',
      endDateTime: '2025-12-20T18:00:00',
      status: 'upcoming',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop&auto=format'
    },
    {
      _id: '2',
      title: 'Abstract Modern Art Painting',
      description: 'Original artwork by contemporary artist, signed and authenticated.',
      basePrice: 5000,
      startDateTime: '2025-12-01T09:00:00',
      endDateTime: '2025-12-10T20:00:00',
      status: 'ongoing',
      imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop&auto=format'
    },
    {
      _id: '3',
      title: 'Antique Persian Rug',
      description: 'Hand-woven Persian rug from the 19th century, museum quality piece.',
      basePrice: 8500,
      startDateTime: '2025-12-08T12:00:00',
      endDateTime: '2025-12-12T15:00:00',
      status: 'ongoing',
      imageUrl: 'https://images.unsplash.com/photo-1585821569331-f071db2abd8d?w=400&h=300&fit=crop&auto=format'
    },
    {
      _id: '4',
      title: 'Classic Ferrari Model Car Collection',
      description: 'Limited edition die-cast Ferrari collection with certificates of authenticity.',
      basePrice: 2500,
      startDateTime: '2025-11-20T10:00:00',
      endDateTime: '2025-11-25T18:00:00',
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&auto=format'
    },
    {
      _id: '5',
      title: 'Signed Baseball Collection',
      description: 'Collection of baseballs signed by Hall of Fame players.',
      basePrice: 3500,
      startDateTime: '2025-11-15T08:00:00',
      endDateTime: '2025-11-22T20:00:00',
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop&auto=format'
    },
    {
      _id: '6',
      title: 'Victorian Era Jewelry Set',
      description: 'Complete Victorian jewelry set including necklace, earrings, and brooch.',
      basePrice: 12000,
      startDateTime: '2025-12-18T11:00:00',
      endDateTime: '2025-12-25T19:00:00',
      status: 'upcoming',
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format'
    }
  ];

  // Small helper component to show a skeleton while image loads and a fallback on error
  const RemoteImage = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      setLoaded(false);
      setError(false);
      if (!src) {
        setError(true);
        return;
      }
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }, [src]);

    if (error) {
      return (
        <img
          src={'https://via.placeholder.com/400x300/1e293b/64748b?text=No+Image'}
          alt={alt}
          className={className}
        />
      );
    }

    return (
      <>
        {!loaded && (
          <div className={`${className} bg-slate-700/40 animate-pulse`} />
        )}
        {loaded && (
          <img src={src} alt={alt} className={className} />
        )}
      </>
    );
  };

  // Sort auctions to show ongoing first
  const sortAuctions = (auctionsList) => {
    return [...auctionsList].sort((a, b) => {
      const statusOrder = { ongoing: 0, upcoming: 1, past: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  };

  useEffect(() => {
    fetchAuctions();
    loadAuctioneerName();
  }, []);

  useEffect(() => {
    let filtered = auctions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(auction => auction.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Always sort to show ongoing auctions first
    filtered = sortAuctions(filtered);
    setFilteredAuctions(filtered);
  }, [auctions, searchQuery, statusFilter]);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      // Try to read auctioner id from sessionStorage (set at signin)
      let auctionerId = '';
      try {
        const auctioneerDataJson = sessionStorage.getItem('auctioneerData');
        if (auctioneerDataJson) {
          const auctioneerData = JSON.parse(auctioneerDataJson);
          if (auctioneerData && auctioneerData._id) auctionerId = auctioneerData._id;
        }
      } catch (err) {
        console.warn('Could not read auctioneerData from sessionStorage', err);
      }

      // fallback to localStorage if not present
      if (!auctionerId) auctionerId = localStorage.getItem('auctioneerId') || localStorage.getItem('auctioneer_id') || '';

      if (!auctionerId) {
        // no auctioner id available — use dummy data
        setAuctions(sortAuctions(dummyAuctions));
        setIsLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:9000/api/auctions/by-auctioner/${auctionerId}`);
      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to fetch auctions for auctioner', text);
        setApiError(`Failed to load auctions: ${text || res.statusText}`);
        // fallback to dummy data on error
        setAuctions(sortAuctions(dummyAuctions));
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      // backend returns { auctions: [...] }
      const fetched = Array.isArray(json.auctions) ? json.auctions : [];

      // Normalize fields if necessary and sort
      const normalized = fetched.map(a => ({
        _id: a._id,
        title: a.title,
        description: a.description || '',
        basePrice: typeof a.basePrice === 'number' ? a.basePrice : Number(a.basePrice) || 0,
        startDateTime: a.startDateTime || a.start || '',
        endDateTime: a.endDateTime || a.end || '',
        status: a.status || 'upcoming',
        imageUrl: a.imageUrl || '',
        imageBase64: a.imageBase64 || null,
      }));

      setAuctions(sortAuctions(normalized));
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setApiError('Network error while loading auctions');
      setAuctions(sortAuctions(dummyAuctions));
    } finally {
      setIsLoading(false);
    }
  };

  const loadAuctioneerName = () => {
    try {
      // Try sessionStorage first
      const auctioneerDataJson = sessionStorage.getItem('auctioneerData');
      if (auctioneerDataJson) {
        const auctioneerData = JSON.parse(auctioneerDataJson);
        if (auctioneerData) {
          // Try different possible field names for name
          const name = auctioneerData.name || auctioneerData.username || auctioneerData.fullName || auctioneerData.email || 'Auctioneer';
          setAuctioneerName(name);
          return;
        }
      }

      // Try localStorage
      const userName = localStorage.getItem('userName') || localStorage.getItem('auctioneerName') || localStorage.getItem('user');
      if (userName) {
        try {
          // Check if it's JSON
          const parsed = JSON.parse(userName);
          setAuctioneerName(parsed.name || parsed.username || parsed.email || 'Auctioneer');
        } catch {
          // It's a plain string
          setAuctioneerName(userName);
        }
      } else {
        setAuctioneerName('Auctioneer');
      }
    } catch (err) {
      console.warn('Could not load auctioneer name', err);
      setAuctioneerName('Auctioneer');
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:9000/api/auctions/auction/${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Delete failed:', text);
        setApiError(`Failed to delete auction: ${text || res.statusText}`);
        return;
      }

      // remove from UI
      const updatedAuctions = auctions.filter(a => a._id !== auctionId);
      setAuctions(sortAuctions(updatedAuctions));
    } catch (err) {
      console.error('Network error deleting auction:', err);
      setApiError('Network error while deleting auction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAuction = () => {
    navigate("/create-auction")
  };

  const handleEditAuction = (auction) => {
    setEditingAuction({ ...auction });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAuction) return;
    setIsLoading(true);
    try {
      const auctionId = editingAuction._id;
      const payload = {
        title: editingAuction.title,
        description: editingAuction.description,
        basePrice: editingAuction.basePrice,
        startDateTime: editingAuction.startDateTime,
        endDateTime: editingAuction.endDateTime,
      };

      const res = await fetch(`http://localhost:9000/api/auctions/auction/${auctionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Update failed:', text);
        setApiError(`Failed to update auction: ${text || res.statusText}`);
        return;
      }

      const json = await res.json();
      const updatedAuctionRaw = json.auction || json;

      // Normalize updated auction to keep imageUrl / imageBase64 shape consistent
      const normalizedUpdated = {
        _id: updatedAuctionRaw._id || auctionId,
        title: updatedAuctionRaw.title || editingAuction.title,
        description: updatedAuctionRaw.description || editingAuction.description || '',
        basePrice: typeof updatedAuctionRaw.basePrice === 'number' ? updatedAuctionRaw.basePrice : Number(updatedAuctionRaw.basePrice) || editingAuction.basePrice || 0,
        startDateTime: updatedAuctionRaw.startDateTime || updatedAuctionRaw.start || editingAuction.startDateTime || '',
        endDateTime: updatedAuctionRaw.endDateTime || updatedAuctionRaw.end || editingAuction.endDateTime || '',
        status: updatedAuctionRaw.status || editingAuction.status || 'upcoming',
        // server may return the raw base64 in `file` or already normalized fields; prefer `file` then `imageBase64`, else keep existing
        imageBase64: updatedAuctionRaw.file || updatedAuctionRaw.imageBase64 || editingAuction.imageBase64 || null,
        imageUrl: updatedAuctionRaw.imageUrl || `http://localhost:9000/api/auctions/${updatedAuctionRaw._id || auctionId}/image`,
      };

      const updatedAuctions = auctions.map(a => a._id === (normalizedUpdated._id || auctionId) ? { ...a, ...normalizedUpdated } : a);
      setAuctions(sortAuctions(updatedAuctions));
      setIsEditModalOpen(false);
      setEditingAuction(null);
    } catch (err) {
      console.error('Network error updating auction:', err);
      setApiError('Network error while updating auction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAuction = (auction) => {
    navigate("/live/" + auction._id);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    sessionStorage.removeItem('auctioneerData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('auctioneerId');
    localStorage.removeItem('auctioneer_id');
    // Navigate to signin page
    navigate("/");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      ongoing: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30' },
      past: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' }
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReport = async (auctionId) => {
    setPdfLoading(true);
    try {
      const response = await fetch(
        `http://localhost:9000/api/auctionReport/report/download/${auctionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsPdfModalOpen(true);
    } catch (err) {
      console.error('Error downloading report:', err);
      setApiError('Failed to load PDF report');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `auction_report_${reportAuctionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 relative overflow-hidden"
      onClick={(e) => {
        // Close dropdown when clicking outside
        if (isProfileDropdownOpen && !e.target.closest('.profile-dropdown-container')) {
          setIsProfileDropdownOpen(false);
        }
      }}
    >
      {/* Subtle Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6 shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-200 via-sky-200 to-white bg-clip-text text-transparent">
              My Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Manage Auctions</p>
          </div>
          
          {/* Profile Icon with Dropdown */}
          <div className="relative profile-dropdown-container">
            <button
              onClick={handleProfileClick}
              className="p-3 bg-slate-700/60 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:bg-slate-700 hover:border-sky-500/50 transition-all group"
              title="Profile Menu"
            >
              <User size={24} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-50">
                {/* User Name Header */}
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-700/30">
                  <p className="text-xs text-slate-400 mb-1">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{auctioneerName}</p>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/auctioneer-profile");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 hover:text-sky-400 transition-all flex items-center gap-3"
                  >
                    <User size={18} />
                    <span className="font-medium">View Profile</span>
                  </button>
                  <div className="border-t border-slate-700/50 my-1"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center gap-3"
                  >
                    <svg 
                      className="w-[18px] h-[18px]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* API Error Banner */}
      {apiError && (
        <div className="max-w-7xl mx-auto mt-4 px-6">
          <div className="bg-red-600/10 border border-red-600/30 text-red-300 p-3 rounded-lg">
            <strong className="mr-2">Error:</strong>
            <span>{apiError}</span>
            <button
              onClick={() => setApiError(null)}
              className="ml-4 text-sm px-2 py-1 bg-red-600/20 rounded hover:bg-red-600/30"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Search and Filter Bar */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search auctions..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-48">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateAuction}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all shadow-lg shadow-sky-500/20"
            >
              <Plus size={20} className="mr-2" />
              Create Auction
            </button>
          </div>
        </div>

        {/* Auctions Grid */}
        {isLoading && filteredAuctions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center shadow-xl">
            <FileText size={64} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Auctions Found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first auction to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={handleCreateAuction}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all shadow-lg shadow-sky-500/20"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Auction
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAuctions.map((auction) => (
              <div key={auction._id}
                className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-sky-500/50 transition-all group shadow-xl overflow-hidden">
                
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-48 h-32 md:h-40 flex-shrink-0">
                    <RemoteImage
                      src={auction.imageBase64 ? `data:image/jpeg;base64,${auction.imageBase64}` : auction.imageUrl}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Left Side - Main Info */}
                      <div className="flex-1">
                        {/* Status Badge & Title */}
                        <div className="flex items-start justify-between mb-2">
                          {getStatusBadge(auction.status)}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                          {auction.title}
                        </h3>

                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {auction.description}
                        </p>

                        {/* Price and Date Info Combined */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center px-3 py-1.5 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                            <span className="text-sky-400 font-bold text-sm mr-1">₹</span>
                            <span className="text-sky-400 font-bold text-sm">{auction.basePrice.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-slate-400">
                            <Calendar size={14} className="mr-1 text-blue-400" />
                            <span>{formatDate(auction.startDateTime)}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-slate-400">
                            <Clock size={14} className="mr-1 text-indigo-400" />
                            <span>{formatDate(auction.endDateTime)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Action Buttons */}
                      <div className="flex md:flex-col gap-2 justify-end md:justify-start md:items-end">
                        {/* Upcoming - Edit, Delete, View Auction */}
                        {auction.status === 'upcoming' && (
                          <>
                            <button
                              onClick={() => handleEditAuction(auction)}
                              className="flex items-center justify-center gap-2 w-36 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/20 text-sm"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAuction(auction._id)}
                              className="flex items-center justify-center gap-2 w-36 h-10 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-slate-500/20 text-sm"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={() => handleViewAuction(auction)}
                              className="flex items-center justify-center gap-2 w-36 h-10 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-sky-500/20 text-sm"
                              title="View Auction"
                            >
                              <Eye size={16} />
                              <span>View Auction</span>
                            </button>
                          </>
                        )}
                        
                        {/* Ongoing - View Auction */}
                        {auction.status === 'ongoing' && (
                          <button
                            onClick={() => handleViewAuction(auction)}
                            className="flex items-center justify-center gap-2 w-36 h-10 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-sky-500/20 text-sm"
                            title="View Auction"
                          >
                            <Eye size={16} />
                            <span>View Auction</span>
                          </button>
                        )}
                        
                        {/* Completed - Download Report */}
                        {auction.status === 'past' && (
                          <>
                            <button
                              onClick={() => { setReportAuctionId(auction._id); setIsReportOpen(true); }}
                              className="flex items-center justify-center gap-2 w-36 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-emerald-500/20 text-sm"
                              title="View Report"
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDownloadReport(auction._id)}
                              disabled={pdfLoading}
                              className="flex items-center justify-center gap-2 w-36 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-violet-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download Report"
                            >
                              <Download size={16} />
                              <span>{pdfLoading ? 'Loading...' : 'Download'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingAuction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 flex-shrink-0">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-200 via-sky-200 to-white bg-clip-text text-transparent">
                  Edit Auction
                </h2>
                <p className="text-slate-400 text-sm mt-1">Update your auction details</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2.5 hover:bg-slate-700/50 rounded-lg transition-all group"
              >
                <X size={24} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center">
                  <div className="w-1 h-4 bg-sky-500 rounded-full mr-2"></div>
                  Auction Title <span className="text-sky-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={editingAuction.title}
                  onChange={(e) => setEditingAuction({...editingAuction, title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-lg placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all"
                  placeholder="Enter auction title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center">
                  <div className="w-1 h-4 bg-sky-500 rounded-full mr-2"></div>
                  Description <span className="text-sky-400 ml-1">*</span>
                </label>
                <textarea
                  value={editingAuction.description}
                  onChange={(e) => setEditingAuction({...editingAuction, description: e.target.value})}
                  rows="5"
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 resize-none transition-all"
                  placeholder="Describe your auction item..."
                />
                <p className="text-slate-500 text-xs mt-2">{editingAuction.description.length} characters</p>
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center">
                  <div className="w-1 h-4 bg-sky-500 rounded-full mr-2"></div>
                  Starting Bid Price <span className="text-sky-400 ml-1">*</span>
                </label>
                <div className="relative max-w-sm">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-400">
                    <DollarSign size={22} />
                  </span>
                  <input
                    type="number"
                    value={editingAuction.basePrice}
                    onChange={(e) => setEditingAuction({...editingAuction, basePrice: parseFloat(e.target.value)})}
                    className="w-full pl-14 pr-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-xl font-semibold placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center">
                    <div className="w-1 h-4 bg-sky-500 rounded-full mr-2"></div>
                    Auction Starts <span className="text-sky-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none z-10" size={20} />
                    <input
                      type="datetime-local"
                      value={editingAuction.startDateTime}
                      onChange={(e) => setEditingAuction({...editingAuction, startDateTime: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center">
                    <div className="w-1 h-4 bg-sky-500 rounded-full mr-2"></div>
                    Auction Ends <span className="text-sky-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none z-10" size={20} />
                    <input
                      type="datetime-local"
                      value={editingAuction.endDateTime}
                      onChange={(e) => setEditingAuction({...editingAuction, endDateTime: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-4 p-8 border-t border-slate-700/50 bg-slate-900/30 flex-shrink-0">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-8 py-3.5 border border-slate-700/50 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/30 hover:border-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Auction Report Modal */}
      <AuctionReportModal
        isOpen={isReportOpen}
        onClose={() => { setIsReportOpen(false); setReportAuctionId(null); }}
        auctionId={reportAuctionId}
      />

      {/* PDF Viewer Modal */}
      {isPdfModalOpen && pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Auction Report PDF</h2>
              <button
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setPdfUrl(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="overflow-auto max-h-[calc(90vh-140px)] bg-slate-900">
              <iframe
                src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=1'}
                className="w-full h-full min-h-[500px] block"
                title="Auction Report PDF"
                style={{ border: 'none' }}
              />
            </div>

            {/* Footer with Download Button */}
            <div className="bg-slate-900/50 px-6 py-4 border-t border-slate-700/50 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsPdfModalOpen(false);
                  setPdfUrl(null);
                }}
                className="px-6 py-3 rounded-lg font-semibold bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500 text-white transition-all duration-300"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold 
                  bg-gradient-to-r from-sky-500 to-indigo-600 
                  hover:from-sky-600 hover:to-indigo-700 
                  text-white transition-all duration-300 
                  hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30
                  shadow-lg shadow-sky-500/20"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctioneerDashboard;