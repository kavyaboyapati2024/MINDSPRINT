import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, Users, Award, ChevronRight, Atom, Eye, CheckCircle, Star, Sparkles, Rocket, Crown, Diamond } from 'lucide-react';

const AboutUs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Atom className="w-8 h-8" />,
      title: "Quantum Security",
      description: "Leveraging quantum cryptography to ensure unbreakable security for all auction data and sealed bids."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Sealed Bid Auctions",
      description: "Fair and transparent sealed bid processes where all bids remain confidential until auction completion."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Zero Trust Architecture",
      description: "Military-grade security protocols protecting every transaction and user interaction on our platform."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Settlement",
      description: "Lightning-fast bid processing and settlement powered by advanced quantum computing algorithms."
    }
  ];

  const stats = [
    { number: "99.99%", label: "Uptime Guarantee", icon: <Crown className="w-6 h-6" /> },
    { number: "256-bit", label: "Quantum Encryption", icon: <Lock className="w-6 h-6" /> },
    { number: "50k+", label: "Successful Auctions", icon: <Award className="w-6 h-6" /> },
    { number: "24/7", label: "Support Coverage", icon: <Shield className="w-6 h-6" /> }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Secure Registration",
      description: "Create your quantum-secured account with multi-factor authentication.",
      icon: <UserPlus className="w-6 h-6" />
    },
    {
      step: "02", 
      title: "Submit Sealed Bids",
      description: "Place your confidential bids using our quantum-encrypted submission system. No one can see your bid amount.",
      icon: <Lock className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Fair Evaluation",
      description: "All bids are simultaneously revealed using quantum-secure protocols, ensuring complete transparency and fairness.",
      icon: <Eye className="w-6 h-6" />
    },
    {
      step: "04",
      title: "Instant Settlement",
      description: "Winners are determined instantly, and transactions are processed through our secure payment gateway.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-emerald-500/6 to-teal-500/6 rounded-full blur-2xl"></div>
        <div className="absolute top-1/6 right-1/6 w-72 h-72 bg-gradient-to-r from-yellow-500/4 to-orange-500/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-gradient-to-r from-violet-500/6 to-purple-500/6 rounded-full blur-3xl"></div>
        
        {/* Mouse-following gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-sky-400/5 to-purple-400/5 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        ></div>
      </div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            {/* Logo */}
            <div className="relative inline-block mb-6">
              <h1 className="text-3xl lg:text-3xl font-black text-sky-400 mb-2">
                Quantum-Bid
              </h1>
              <div className="absolute -inset-4 bg-sky-500/10 rounded-full blur-2xl opacity-60"></div>
            </div>

            <div className="relative">
              <p className="text-lg lg:text-xl text-white font-bold mb-6">
                The Future of Quantum-Secured Sealed Bid Auctions
              </p>
            </div>
            
            <div className="w-32 h-1 bg-sky-500 mx-auto rounded-full"></div>
          </div>

          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-sky-500/30
              shadow-[0_0_0_1px_rgba(30,41,59,0.1),0_0_40px_rgba(0,0,0,0.8),0_0_80px_rgba(15,23,42,0.6)]">
              
              <div className="relative z-10 text-center">
                
                
                <h2 className="text-2xl font-black text-sky-400 mb-6">
                  Revolutionizing Digital Auctions
                </h2>
                
                <p className="text-slate-200/90 text-lg leading-relaxed mb-8 font-medium">
                  At Quantum-Bid, we believe that the future of digital commerce lies in the perfect fusion of 
                  <span className="text-sky-400 font-bold"> quantum security</span> and 
                  <span className="text-sky-400 font-bold"> transparent auction mechanisms</span>. 
                  Our platform exclusively hosts sealed bid auctions, ensuring complete fairness and confidentiality while leveraging cutting-edge quantum cryptography 
                  to protect every aspect of your bidding experience.
                </p>
                
                <div className="inline-flex items-center space-x-3 bg-sky-500/20 px-6 py-3 rounded-full border border-sky-500/30 backdrop-blur-sm">
                  <div className="bg-sky-500/20 p-2 rounded-full">
                    <Diamond className="w-5 h-5 text-sky-400" />
                  </div>
                  <span className="text-sky-300 font-bold text-base">
                    Quantum-Protected Since 2024
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-center text-sky-400 mb-12">
              Why Choose Quantum-Bid?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} 
                  className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30
                    shadow-[0_0_30px_rgba(0,0,0,0.6),0_0_60px_rgba(15,23,42,0.4)] hover:shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_100px_rgba(15,23,42,0.6)] 
                    transition-shadow duration-300">
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-500 rounded-full mb-6">
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-black text-sky-400 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300/90 text-sm leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-sky-500/30
              shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_80px_rgba(15,23,42,0.6)]">
              
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-center text-sky-400 mb-12">
                  Trusted by Thousands
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-500 rounded-full mb-3">
                        <div className="text-white">{stat.icon}</div>
                      </div>
                      <div className="text-2xl lg:text-3xl font-black text-sky-400 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-slate-300/90 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-4xl font-black text-center text-sky-400 mb-12">
              How Sealed Bid Auctions Work
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {processSteps.map((item, index) => (
                  <div key={index} 
                    className="flex items-center space-x-6 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-sky-500/30
                      shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(0,0,0,0.7)] transition-shadow duration-300">
                    
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center relative">
                        <span className="text-white font-black text-lg">{item.step}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-sky-400 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-300/90 leading-relaxed font-medium text-sm">{item.description}</p>
                    </div>
                    
                    
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-12 border border-sky-500/30
              shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_100px_rgba(15,23,42,0.6)]">
              
              <div className="relative z-10">
                
                
                <h2 className="text-3xl font-black text-sky-400 mb-6">
                  Ready to Experience Quantum-Secured Auctions?
                </h2>
                
                <p className="text-slate-200/90 text-lg mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
                  Join thousands of users who trust Quantum-Bid for secure, fair, and transparent sealed bid auctions. 
                  <span className="text-sky-400 font-bold"> Experience the future</span> of digital commerce today.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="px-10 py-4 bg-sky-500 text-white font-black rounded-2xl text-base
                    hover:bg-sky-400 transition-colors duration-300
                    shadow-[0_0_40px_rgba(14,165,233,0.4),0_15px_30px_rgba(0,0,0,0.3)] 
                    hover:shadow-[0_0_60px_rgba(14,165,233,0.6),0_20px_40px_rgba(0,0,0,0.4)]">
                    <span className="flex items-center">
                      
                      Start Bidding Today
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// UserPlus component
const UserPlus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

export default AboutUs;