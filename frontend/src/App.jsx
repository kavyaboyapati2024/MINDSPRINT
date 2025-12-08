import { Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import AuctionHomepage from "./pages/Auctions/AuctionHome";
import AuctionRegistrationForm from "./components/auction/AuctionRegistrationForm";
import Landing from "./pages/Landing";
import AboutUs from "./pages/Auctions/AboutUs";
import Faqs from "./pages/Auctions/Faqs";
import LiveAuction from "./pages/Auctions/LiveAuction";
import PaymentCallback from "./pages/PaymentCallback";
import UpcomingAuctions from "./components/auction/UpcomingAuctions";
import OngoingAuctions from "./components/auction/OngoingAuctions";
import CompletedAuctions from "./components/auction/CompletedAuctions";
import ViewLiveAuction from "./pages/Auctions/ViewLiveAuction"
import UserProfile from "./pages/UserProfile"
import MyAuctions from "./pages/MyAuctions"
import AuctioneerSignin from "./pages/Auctioneer/Signin";
import AuctioneerSignup from "./pages/Auctioneer/Signup";
import AuctioneerForgotPassword from "./pages/Auctioneer/AuctioneerForgotPassword";
import AuctioneerDashboard from "./pages/Auctioneer/AuctioneerDashboard";
import CreateAuction from "./pages/Auctioneer/CreateAuction";
import AuctioneerProfile from "./pages/Auctioneer/AuctionerProfile";
import AuctioneerLivePage from "./pages/Auctioneer/LiveAuctionPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />  {/* 👈 now landing page is root */}
      <Route path="/signup/user" element={<Signup />} />
      <Route path="/signin/user" element={<Signin />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/forgot-password/user" element={<ForgotPassword />} />
      <Route path="/home" element={<AuctionHomepage />} />
      <Route path="/live" element={<LiveAuction/>}/>
      <Route path="/live/:auctionId" element={<LiveAuction/>}/>
      <Route path="/about" element={<AboutUs/>}/>
      <Route path="/Faqs" element={<Faqs/>}/>
      <Route path="/view-auction" element={<ViewLiveAuction/>}/>
      <Route path="/profile" element={<UserProfile/>}/>
      <Route path="my-auctions" element={<MyAuctions/>}/>
      <Route path="/payment-callback" element={<PaymentCallback />} />
      <Route path="/upcoming-auctions" element={<UpcomingAuctions userId={localStorage.getItem("userId")} />} />
      <Route path="/ongoing-auctions" element={<OngoingAuctions/>} />
      <Route path="/past-auctions" element={<CompletedAuctions/>} />
      <Route path="/signin/auctioneer" element={<AuctioneerSignin/>}/>
      <Route path="signup/auctioneer" element={<AuctioneerSignup/>}/>
      <Route path="forgot-password/auctioneer" element={<AuctioneerForgotPassword/>}/>
      <Route path="/auctioneer-dashboard" element={<AuctioneerDashboard/>}/>
      <Route path="/create-auction" element={<CreateAuction/>}/>
      <Route path="/auctioneer-profile" element={<AuctioneerProfile/>}/>
      <Route path="/live-panel" element={<AuctioneerLivePage/>}/>
    </Routes>
  );
}

export default App;
