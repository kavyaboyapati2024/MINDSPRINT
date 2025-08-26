import React from "react";
import Prism from "../components/prism";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation hook

/** Spinning quantum/atom logo */
const QuantumLogo = ({ size = 40 }) => {
  return (
    <div
      className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg p-2"
      style={{ width: size, height: size }}
      aria-label="EQ-Auction quantum logo"
    >
      <motion.svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        {/* nucleus */}
        <circle cx="32" cy="32" r="6" fill="white" opacity="0.95" />
        <circle cx="32" cy="32" r="10" fill="none" stroke="white" strokeOpacity="0.3" />

        {/* orbit 1 */}
        <g>
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <circle cx="54" cy="32" r="3" fill="white" />
        </g>

        {/* orbit 2 (tilted) */}
        <g transform="rotate(60 32 32)">
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.35"
          />
          <circle cx="54" cy="32" r="3" fill="white" />
        </g>

        {/* orbit 3 (tilted) */}
        <g transform="rotate(120 32 32)">
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.35"
          />
          <circle cx="54" cy="32" r="3" fill="white" />
        </g>
      </motion.svg>
    </div>
  );
};

function Landing() {
  const navigate = useNavigate(); // ✅ hook for navigation

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Prism Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80">
        <div style={{ width: "100%", height: "650px", position: "relative" }}>
          <Prism
            animationType="rotate"
            timeScale={0.55}
            height={3.8}
            baseWidth={6.0}
            scale={3.5}
            hueShift={220}
            colorFrequency={0.9}
            noise={0.4}
            glow={0.9}
          />
        </div>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
        <QuantumLogo size={44} />
        <div>
          <h1 className="text-lg font-semibold">Quantum-BID</h1>
          <p className="text-xs text-gray-400">Quantum Secured</p>
        </div>
      </div>

      {/* ✅ Sign In button with navigation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/signin")} // ✅ redirect on click
        className="absolute top-6 right-6 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-lg z-10"
      >
        <LogIn size={18} />
        Sign In
      </motion.button>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mt-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          The Future of <span className="text-blue-400">Quantum Auctions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-gray-300 mb-10"
        >
          Where quantum cryptography meets cutting-edge auction technology.  
          Experience unbreakable security and unprecedented transparency in every transaction.
        </motion.p>
      </div>
    </div>
  );
}

export default Landing;
