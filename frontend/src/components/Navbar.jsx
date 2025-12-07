import React, { useState, useRef, useEffect } from 'react';
import { User, UserCircle, Gavel, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import your AuthService here
import AuthService from '../services/authServices'; // adjust the path if needed

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', route: '/home' },
    { name: 'About', route: '/about' },
    { name: "FAQ's", route: '/Faqs' }
  ];

  const dropdownItems = [
    { name: 'Profile', icon: UserCircle, desc: 'Manage your account' },
    { name: 'My Auctions', icon: Gavel, desc: 'View registered auctions' },
    { name: 'Logout', icon: LogOut, desc: 'Sign out of account', isLogout: true }
  ];

  // Function to determine if a nav item is active based on current route
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  // Load user data from session storage on component mount
  useEffect(() => {
    const loadUserData = () => {
      const user = AuthService.getCurrentUser();
      
      if (user) {
        setUserData(user);
        console.log('User data loaded:', user);
      } else {
        console.log('No user data found');
        // Optionally redirect to signin if no user data
        // navigate('/signin/user');
      }
    };

    loadUserData();
  }, []);

  // Listen for storage changes (useful if user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const user = AuthService.getCurrentUser();
        setUserData(user);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle navigation item clicks
  const handleNavItemClick = (item) => {
    navigate(item.route);
  };

  // Handle logo click - redirect to home
  const handleLogoClick = () => {
    navigate('/home');
  };

  // Handle dropdown item clicks
  const handleDropdownItemClick = async (itemName) => {
    console.log(`${itemName} clicked`);
    setIsDropdownOpen(false);
    
    if (itemName === 'Logout') {
      try {
        console.log('Logging out user...');
        
        // Call your AuthService logout function
        const result = await AuthService.logout();
        
        if (result.success) {
          console.log('Logout successful:', result);
          
          // Clear local state
          setUserData(null);
          
          // Redirect to signin page
          navigate('/signin/user');
          
        } else {
          console.error('Logout failed:', result);
          
          // Handle different error cases
          if (result.status === 401) {
            // User already logged out or session expired
            setUserData(null);
            navigate('/signin');
          } else {
            // Other server errors
            alert(result.message || 'Logout failed. Please try again.');
          }
        }
        
      } catch (error) {
        console.error('Logout error:', error);
        
        // Network or unexpected error
        alert('Network error occurred during logout. Please try again.');
      }
    } else if (itemName === 'Profile') {
      navigate('/profile');
    } else if (itemName === 'My Auctions') {
      navigate('/my-auctions');
    }
  };

  // Helper function to get user's display name
  const getUserDisplayName = () => {
    if (!userData) return 'Guest User';
    
    // Try different possible name fields in order of preference
    if (userData.fullName) return userData.fullName;
    if (userData.name) return userData.name;
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (userData.firstName) return userData.firstName;
    if (userData.userName) return userData.userName;
    if (userData.username) return userData.username;
    if (userData.email) return userData.email.split('@')[0]; // Use email prefix as fallback
    
    return 'User';
  };

  // Helper function to get user's role/type
  const getUserRole = () => {
    if (!userData) return 'Guest';
    
    // Try different possible role fields
    if (userData.role) return userData.role;
    if (userData.userType) return userData.userType;
    if (userData.accountType) return userData.accountType;
    
    return 'Bidder'; // Default role
  };

  // Helper function to get user initials for avatar
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    
    if (displayName === 'Guest User' || displayName === 'User') {
      return 'GU';
    }
    
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pt-4 pb-2 bg-transparent pointer-events-none">
      <div className="w-[90%] max-w-6xl mx-auto pointer-events-auto">
        <div className="flex justify-between items-center space-x-4">

          {/* Left Capsule - Quantum-BID Logo in capsule form */}
          <button 
            onClick={handleLogoClick}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full px-6 py-3 shadow-2xl border border-blue-400/30 hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 flex items-center space-x-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {/* Atom Symbol Container */}
            <div className="flex items-center justify-center">
              {/* Clean Simple Atom Symbol - matching the image */}
              <div className="relative w-6 h-6">
                {/* Central nucleus dot */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Electron particles around */}
                <div className="absolute top-1 left-2 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute top-2 left-0.5 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                <div className="absolute top-3.5 left-1 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                <div className="absolute top-1.5 right-0.5 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                <div className="absolute bottom-1 right-2 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute bottom-2 right-0.5 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                
                {/* Simple orbital rings - non-rotating, clean style */}
                <div className="absolute inset-0">
                  <div className="w-6 h-6 border border-white/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
            
            {/* Text Content */}
            <div>
              <span className="text-white font-bold text-base tracking-wide">Quantum-BID</span>
            </div>
          </button>

          {/* Center Capsule - Navigation */}
          <div className="bg-black/20 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/10 flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isActiveRoute(item.route)
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg backdrop-blur-sm border border-blue-400/50 shadow-blue-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Capsule - Professional Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`group bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-full p-4 shadow-2xl border border-slate-600/30 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                isDropdownOpen ? 'ring-2 ring-blue-500/50 shadow-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/10' : ''
              }`}
            >
              <div className="relative">
                <User className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-800"></div>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 ml-2 transition-all duration-300 ${
                isDropdownOpen ? 'rotate-180 text-blue-400' : 'group-hover:text-white'
              }`} />
            </button>

            {/* Professional Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                
                {/* User Info Header - Now Dynamic */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      {userData?.profilePicture || userData?.avatar ? (
                        <img 
                          src={userData.profilePicture || userData.avatar} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {getUserDisplayName()}
                      </h3>
                      <p className="text-slate-400 text-xs truncate">
                        {getUserRole()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {dropdownItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleDropdownItemClick(item.name)}
                        className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group focus:outline-none focus:bg-blue-500/20 ${
                          item.isLogout 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10 border-t border-slate-700/50 mt-2' 
                            : 'text-slate-300 hover:text-white hover:bg-blue-500/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                          item.isLogout 
                            ? 'bg-red-500/10 group-hover:bg-red-500/20' 
                            : 'bg-blue-500/10 group-hover:bg-blue-500/20'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-500 group-hover:text-slate-400">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Footer */}
                <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    {userData?.email && (
                      <span className="truncate flex-1 mr-2">{userData.email}</span>
                    )}
                    <span className="flex items-center space-x-1 flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Online</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;