import React, { useEffect, useState } from "react";
import { User, Calendar, Sparkles, Info } from "lucide-react";
import axios from "axios";
import RegistrationModal from "./RegistrationModal";
import ViewAuctionModal from "./ViewAuctionModal";

const UpcomingAuctions = ({ userId }) => {
  const [currentBidderId, setCurrentBidderId] = useState(null);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [recommendedAuctionIds, setRecommendedAuctionIds] = useState(new Set());
  const [registeredAuctions, setRegisteredAuctions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [viewAuction, setViewAuction] = useState(null);

  useEffect(() => {
    const fetchCurrentBidder = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9000/api/bids/get-bidder-id",
          { withCredentials: true }
        );

        setCurrentBidderId(res.data.userId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentBidder();
  }, []);

  userId = currentBidderId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [upcomingRes, registeredRes] = await Promise.all([
          axios.get("http://localhost:9000/api/auctions/upcoming"),
          userId
            ? axios.get(
                `http://localhost:9000/api/auctionRegistrations/registered/${userId}`
              )
            : Promise.resolve({ data: { registeredAuctionIds: [] } }),
        ]);

        const recommendationsRes = { data: { recommendations: [] } };

        const raw = Array.isArray(upcomingRes.data.upcoming)
          ? upcomingRes.data.upcoming
          : [];

        const enriched = await Promise.all(
          raw.map(async (a) => {
            const auctionerId = a.auctionerId || a.auctioner_id;
            if (auctionerId) {
              try {
                const { getAuctionerName } = await import(
                  "../../services/auctionerService.js"
                );
                const name = await getAuctionerName(auctionerId);
                return { ...a, auctioneer: name };
              } catch (e) {
                return { ...a, auctioneer: a.auctioneer };
              }
            }
            return { ...a, auctioneer: a.auctioneer };
          })
        );

        const demoRecommendedIds = enriched.length > 0 ? [enriched[0]._id] : [];

        const recommendedIds = new Set(
          recommendationsRes.data.recommendations?.length
            ? recommendationsRes.data.recommendations.map((rec) => rec.auctionId)
            : demoRecommendedIds
        );

        const sortedAuctions = enriched.sort((a, b) => {
          const aR = recommendedIds.has(a._id);
          const bR = recommendedIds.has(b._id);
          if (aR && !bR) return -1;
          if (!aR && bR) return 1;
          return 0;
        });

        setUpcomingAuctions(sortedAuctions);
        setRecommendedAuctionIds(recommendedIds);
        setRegisteredAuctions(new Set(registeredRes.data.registeredAuctionIds));
      } catch (err) {
        setError("Failed to load auctions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const paymentStatus = sessionStorage.getItem("paymentStatus");
    const paidAuctionId = sessionStorage.getItem("auctionId");

    if (paymentStatus && paidAuctionId && upcomingAuctions.length > 0) {
      const auction = upcomingAuctions.find((a) => a._id === paidAuctionId);
      if (auction) {
        setSelectedAuction({
          ...auction,
          basePrice: auction.baseAmount,
          paymentDone: paymentStatus === "success",
        });
      }
      sessionStorage.removeItem("paymentStatus");
      sessionStorage.removeItem("auctionId");
    }
  }, [upcomingAuctions]);

  const ActionButton = ({ type, onClick, isRegistered = false }) => {
    const label =
      type === "register" ? (isRegistered ? "Registered" : "Register") : "View";

    return (
      <button
        onClick={onClick}
        disabled={isRegistered}
        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:scale-105 ${
          type === "register"
            ? isRegistered
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
        }`}
      >
        {label}
      </button>
    );
  };

  if (loading)
    return (
      <p className="text-center text-slate-400 py-4">Loading upcoming auctions...</p>
    );

  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <>
      {/* 🌈 CSS FOR RAINBOW GLOW + SHIMMER */}
      <style>
        {`
          @keyframes glow-pulse {
            0% {
              box-shadow: 0 0 20px rgba(255, 0, 0, 0.4),
                          0 0 40px rgba(255, 0, 0, 0.2),
                          inset 0 0 20px rgba(255, 0, 0, 0.1);
            }
            16.66% {
              box-shadow: 0 0 25px rgba(255, 165, 0, 0.5),
                          0 0 50px rgba(255, 165, 0, 0.25),
                          inset 0 0 25px rgba(255, 165, 0, 0.15);
            }
            33.33% {
              box-shadow: 0 0 30px rgba(255, 255, 0, 0.6),
                          0 0 60px rgba(255, 255, 0, 0.3),
                          inset 0 0 30px rgba(255, 255, 0, 0.2);
            }
            50% {
              box-shadow: 0 0 25px rgba(0, 255, 0, 0.5),
                          0 0 50px rgba(0, 255, 0, 0.25),
                          inset 0 0 25px rgba(0, 255, 0, 0.15);
            }
            66.66% {
              box-shadow: 0 0 25px rgba(0, 0, 255, 0.5),
                          0 0 50px rgba(0, 0, 255, 0.25),
                          inset 0 0 25px rgba(0, 0, 255, 0.15);
            }
            83.33% {
              box-shadow: 0 0 25px rgba(148, 0, 211, 0.5),
                          0 0 50px rgba(148, 0, 211, 0.25),
                          inset 0 0 25px rgba(148, 0, 211, 0.15);
            }
            100% {
              box-shadow: 0 0 20px rgba(255, 0, 0, 0.4),
                          0 0 40px rgba(255, 0, 0, 0.2),
                          inset 0 0 20px rgba(255, 0, 0, 0.1);
            }
          }
          
          .recommended-glow {
            animation: glow-pulse 3s ease-in-out infinite;
            background: linear-gradient(
              90deg,
              rgba(255, 0, 0, 0.05) 0%,
              rgba(255, 165, 0, 0.05) 16.66%,
              rgba(255, 255, 0, 0.08) 33.33%,
              rgba(0, 255, 0, 0.08) 50%,
              rgba(0, 0, 255, 0.08) 66.66%,
              rgba(148, 0, 211, 0.05) 83.33%,
              rgba(255, 0, 0, 0.05) 100%
            );
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          .shimmer-effect {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 0, 0, 0.15),
              rgba(255, 165, 0, 0.15),
              rgba(255, 255, 0, 0.2),
              rgba(0, 255, 0, 0.2),
              rgba(0, 0, 255, 0.2),
              rgba(148, 0, 211, 0.15),
              transparent
            );
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }

          @keyframes dot-pulse {
            0% {
              transform: scale(1);
              background: linear-gradient(135deg, #ff0000, #ffa500);
              box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
                          0 0 20px rgba(255, 0, 0, 0.4);
            }
            16.66% {
              background: linear-gradient(135deg, #ffa500, #ffff00);
              box-shadow: 0 0 12px rgba(255, 165, 0, 0.7),
                          0 0 24px rgba(255, 165, 0, 0.5);
            }
            33.33% {
              background: linear-gradient(135deg, #ffff00, #00ff00);
              box-shadow: 0 0 15px rgba(255, 255, 0, 0.8),
                          0 0 30px rgba(255, 255, 0, 0.6);
            }
            50% {
              transform: scale(1.2);
              background: linear-gradient(135deg, #00ff00, #0000ff);
              box-shadow: 0 0 15px rgba(0, 255, 0, 0.8),
                          0 0 30px rgba(0, 255, 0, 0.6);
            }
            66.66% {
              background: linear-gradient(135deg, #0000ff, #9400d3);
              box-shadow: 0 0 12px rgba(0, 0, 255, 0.7),
                          0 0 24px rgba(0, 0, 255, 0.5);
            }
            83.33% {
              background: linear-gradient(135deg, #9400d3, #ff0000);
              box-shadow: 0 0 12px rgba(148, 0, 211, 0.7),
                          0 0 24px rgba(148, 0, 211, 0.5);
            }
            100% {
              transform: scale(1);
              background: linear-gradient(135deg, #ff0000, #ffa500);
              box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
                          0 0 20px rgba(255, 0, 0, 0.4);
            }
          }

          .glow-dot {
            animation: dot-pulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl" style={{ overflow: 'visible' }}>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] text-white font-semibold rounded-t-2xl">
          <div>Auction Title</div>
          <div>Auctioneer</div>
          <div>Base Price</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Action</div>
        </div>

        {upcomingAuctions.map((auction, index) => {
          const isRecommended = recommendedAuctionIds.has(auction._id);
          const isFirstRecommended = isRecommended && index === 0;

          return (
            <div
              key={index}
              className={`px-4 py-3 border-b border-slate-700/30 last:border-b-0 last:rounded-b-2xl relative hover:bg-blue-500/5 transition-all duration-300 ${
                isFirstRecommended ? "recommended-glow" : ""
              }`}
            >
              {isFirstRecommended && <div className="absolute inset-0 shimmer-effect" />}

              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center relative z-10">
                <div className="font-semibold text-slate-200">{auction.title}</div>

                <div className="flex items-center text-slate-400">
                  <User className="w-3 h-3" /> {auction.auctioneer}
                </div>

                <div className="font-medium text-slate-200">
                  ₹{auction.baseAmount}
                </div>

                <div className="flex items-center text-slate-400">
                  <Calendar className="w-3 h-3" /> {auction.startTime}
                </div>

                <div className="flex items-center text-slate-400">
                  <Calendar className="w-3 h-3" /> {auction.endTime}
                </div>

                {/* ACTION BUTTONS + INFO ICON */}
                <div className="flex gap-2 items-center">
                  <ActionButton
                    type="register"
                    isRegistered={registeredAuctions.has(auction._id)}
                    onClick={() => setSelectedAuction(auction)}
                  />

                  <ActionButton
                    type="view"
                    onClick={() => setViewAuction(auction._id)}
                  />

                  {/* 🔵 Info Icon ONLY for first recommended auction */}
                  {isFirstRecommended && (
                    <div className="relative group">
                      <Info className="w-5 h-5 text-blue-400 cursor-pointer hover:scale-110 transition" />

                      <div className="absolute -left-56 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 w-max">
                        <div className="bg-slate-900 border border-blue-400/50 px-3 py-2 rounded-lg shadow-xl">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-200">
                              Recommended based on your auction history
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAuction && (
        <RegistrationModal
          selectedAuction={selectedAuction}
          isOpen={!!selectedAuction}
          onClose={() => setSelectedAuction(null)}
          userId={userId}
        />
      )}

      {viewAuction && (
        <ViewAuctionModal
          auctionId={viewAuction}
          isOpen={!!viewAuction}
          onClose={() => setViewAuction(null)}
          registeredAuctions={registeredAuctions}
          setSelectedAuction={setSelectedAuction}
        />
      )}
    </>
  );
};

export default UpcomingAuctions;  