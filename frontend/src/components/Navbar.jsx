import React from 'react';
import { TrendingUp, Home, Users, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';   // ✅ Import navigate hook
import AuthService from '../services/authServices'; // adjust the path if needed

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const NavLink = ({ href, icon, label, isActive = false, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      const result = await AuthService.logout();
      if (result.success) {
        // ✅ Clear local auth data if any (like tokens)
        localStorage.removeItem('user'); 
        localStorage.removeItem('token'); 

        // ✅ Redirect to signin page
        navigate('/signin');
      } else {
        console.error('Logout failed:', result.message || 'Unknown error');
        alert(result.message || 'Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Something went wrong during logout.');
    }
  };

  return (
    <nav className="relative bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Quantum Bid
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink 
              href="#home" 
              icon={<Home className="w-4 h-4" />} 
              label="Home" 
              isActive={true}
            />
            <NavLink 
              href="#about" 
              icon={<Users className="w-4 h-4" />} 
              label="About Us" 
            />
            <NavLink 
              href="#faqs" 
              icon={<HelpCircle className="w-4 h-4" />} 
              label="FAQs" 
            />
          </div>

          {/* Logout Button - Desktop */}
          <div className="hidden md:block">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/40"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              <NavLink 
                href="#home" 
                icon={<Home className="w-4 h-4" />} 
                label="Home" 
                isActive={true}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink 
                href="#about" 
                icon={<Users className="w-4 h-4" />} 
                label="About Us"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink 
                href="#faqs" 
                icon={<HelpCircle className="w-4 h-4" />} 
                label="FAQs"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="h-px bg-slate-600 my-3"></div>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
