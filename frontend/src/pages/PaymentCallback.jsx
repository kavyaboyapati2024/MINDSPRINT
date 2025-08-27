import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auctionId = params.get("auction_id");
    const status = params.get("status");

    if (auctionId && status) {
      sessionStorage.setItem("auctionId", auctionId);
      sessionStorage.setItem("paymentStatus", status);
    }

    // Redirect to upcoming auctions
    navigate("/upcoming-auctions");
  }, [navigate]);

  return (
    <div className="text-center mt-20 text-white">
      Processing payment...
    </div>
  );
};

export default PaymentCallback;
