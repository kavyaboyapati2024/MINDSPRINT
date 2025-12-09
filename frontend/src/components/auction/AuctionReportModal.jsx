import React, { useEffect, useState } from "react";
import { X, Download, User, Calendar, TrendingUp } from "lucide-react";

const AuctionReportModal = ({ isOpen, onClose, auctionId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (isOpen && auctionId) {
      fetchReport();
    }
  }, [isOpen, auctionId]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:9000/api/auctionReport/report/${auctionId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError("Failed to load report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(
        `http://localhost:9000/api/auctionReport/report/download/${auctionId}`
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `auction_report_${auctionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Auction Report</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && report && (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Auction Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Auction ID</p>
                    <p className="text-white font-semibold">{report.auctionId}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <p
                      className={`font-bold ${
                        report.finalStatus === "Sold"
                          ? "text-emerald-400"
                          : "text-orange-400"
                      }`}
                    >
                      {report.finalStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Final Price</p>
                    <p className="text-white font-bold text-lg flex items-center gap-1">
                      <span className="inline-flex items-center justify-center w-4 h-4">₹</span>
                      {report.finalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Bids</p>
                    <p className="text-white font-semibold">
                      {report.biddingStats.totalBids}
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-white mb-4">Item Details</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {report.item.image && (
                    <img
                      src={report.item.image}
                      alt={report.item.name || report.item.title}
                      className="w-full md:w-48 h-48 object-cover rounded-lg border border-slate-600"
                    />
                  )}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Title</p>
                      <p className="text-white font-semibold text-lg">
                        {report.item.name || report.item.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Base Price</p>
                      <p className="text-white font-semibold flex items-center gap-1">
                        <span className="inline-flex items-center justify-center w-4 h-4">₹</span>
                        {report.item.basePrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Description</p>
                      <p className="text-white">{report.item.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller & Winner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Seller
                  </h3>
                  <div className="space-y-2">
                    <p className="text-white font-semibold">{report.seller.name || report.seller.fullName}</p>
                    <p className="text-slate-400 text-sm">{report.seller.email}</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    Winner
                  </h3>
                  {report.winner ? (
                    <div className="space-y-2">
                      <p className="text-white font-semibold">{report.winner.name}</p>
                      <p className="text-slate-400 text-sm">{report.winner.email}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No winner</p>
                  )}
                </div>
              </div>

              {/* Bid History */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-white mb-4">Bid History</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {report.biddingStats.bidHistory.length > 0 ? (
                    report.biddingStats.bidHistory.map((bid, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">
                                {bid.bidderName}
                              </p>
                              <p className="text-slate-400 text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(bid.time).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold text-lg flex items-center gap-1 justify-end">
                              <span className="inline-flex items-center justify-center w-4 h-4">₹</span>
                              {bid.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-4">No bids placed</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionReportModal;