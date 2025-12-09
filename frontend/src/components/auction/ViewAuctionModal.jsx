import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const ViewAuctionModal = ({
  auctionId,
  isOpen,
  onClose,
  registeredAuctions = new Set(),
  setSelectedAuction,
}) => {
  const [auction, setAuction] = useState(null);
  const [auctioneerName, setAuctioneerName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auctionId || !isOpen) return;

    const fetchAuction = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:9000/api/auctions/${auctionId}`
        );
        const a = res.data;
        setAuction(a);

        // Resolve canonical auctioneer name via auctionerService when possible
        try {
          // derive id whether populated object or raw id
          const raw = a?.auctionerId;
          const auctionerId = raw && typeof raw === 'string' ? raw : raw?._id || null;
          let name = a?.auctionerId?.name || null;
          if (auctionerId) {
            const { getAuctionerName } = await import('../../services/auctionerService.js');
            try {
              const fetched = await getAuctionerName(auctionerId);
              if (fetched) name = fetched;
            } catch (err) {
              console.warn('Failed to fetch auctioner name for', auctionerId, err);
            }
          }
          setAuctioneerName(name || null);
        } catch (err) {
          console.warn('Auctioneer name enrichment failed', err);
        }
      } catch (err) {
        setError("Failed to load auction details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId, isOpen]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col" style={{ maxHeight: '92vh' }}>
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex-shrink-0 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Auction Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading auction details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          ) : auction ? (
            <div className="space-y-6 pb-4">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  {auction.title}
                </h1>
              </div>

              {/* Image */}
              <div className="flex justify-center">
                <div className="relative rounded-xl overflow-hidden bg-slate-700/30 border border-slate-600/30 w-full max-w-3xl" style={{ height: '320px' }}>
                  <img
                    src={`http://localhost:9000/api/auctions/${auctionId}/image`}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(
                        ".no-image-fallback"
                      ).style.display = "flex";
                    }}
                  />
                  <div
                    className="no-image-fallback absolute inset-0 w-full h-full flex items-center justify-center bg-slate-700 text-slate-400"
                    style={{ display: "none" }}
                  >
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>No Image Available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {auction.description}
                </p>
              </div>

              {/* Auction Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30 hover:bg-slate-700/40 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-white">
                      Auctioneer
                    </span>
                  </div>
                  <p className="text-slate-300 text-lg">
                    {auctioneerName || auction.auctionerId?.name || "Unknown"}
                  </p>
                </div>

                {auction.location && (
                  <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30 hover:bg-slate-700/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-semibold text-white">
                        Location
                      </span>
                    </div>
                    <p className="text-slate-300 text-lg">{auction.location}</p>
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Auction Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span>Start Date & Time</span>
                    </div>
                    <span className="text-slate-200 text-lg ml-6">
                      {new Date(auction.startDateTime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <span>End Date & Time</span>
                    </div>
                    <span className="text-slate-200 text-lg ml-6">
                      {new Date(auction.endDateTime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-5 border border-green-500/30 hover:from-green-500/30 hover:to-green-600/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl text-green-400">₹</span>
                    <span className="text-sm font-semibold text-white">
                      Base Price
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {formatCurrency(auction.basePrice)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-5 border border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-white">
                      Registration Fee (10%)
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    {formatCurrency(auction.basePrice * 0.1)}
                  </div>
                </div>
              </div>

              {/* Static Auction Information */}
              <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Auction Terms & Conditions
                </h4>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">
                      Registration fee of 10% of base price must be paid to
                      participate
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">
                      Winning bidder must complete payment within 24 hours of
                      auction end
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">All sales are final - no returns or exchanges</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">
                      Items must be collected within 7 days of payment
                      completion
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">
                      Registration fee is non-refundable for unsuccessful
                      bidders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-400 text-lg">No details found.</p>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-700/20 flex-shrink-0 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Close
            </button>
            {/* Register Button - Commented out
            <button
              onClick={() => {
                setSelectedAuction(auction); // open registration modal
                onClose(); // close the ViewAuctionModal
              }}
              disabled={registeredAuctions.has(auction?.title)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg text-white ${
                registeredAuctions.has(auction?.title)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
              }`}
            >
              {registeredAuctions.has(auction?.title)
                ? "Registered"
                : "Register for Auction"}
            </button>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAuctionModal;