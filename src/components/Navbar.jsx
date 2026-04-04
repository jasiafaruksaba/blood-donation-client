import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut().then(() => {
      navigate('/');
      setIsMobileMenuOpen(false);
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-red-50 p-1.5 sm:p-2 rounded-xl group-hover:bg-red-100 transition-all duration-300">
              <svg 
                className="w-7 h-7 sm:w-9 sm:h-9 text-red-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent tracking-tight">
              LifeDrop
            </span>
          </Link>

          {/* Desktop Navigation (lg and above) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/donation-requests" 
              className="text-slate-600 hover:text-red-600 font-bold text-base transition-colors duration-200"
            >
              Donation Requests
            </Link>
            
            {user && (
              <Link 
                to="/funding" 
                className="text-slate-600 hover:text-red-600 font-bold text-base transition-colors duration-200"
              >
                Funding
              </Link>
            )}
            
            <div className="h-6 w-px bg-slate-200"></div>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-3 focus:outline-none">
                  <img 
                    src={user?.photoURL} 
                    alt="User" 
                    className="w-11 h-11 rounded-full border-2 border-red-100 object-cover" 
                  />
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                >
                  Join as Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Medium Menu Toggle (md and below) */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Medium Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full right-0 w-64 bg-white shadow-2xl border-l border-b border-slate-100 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col py-8 px-6 space-y-7 text-right">
            <Link 
              to="/donation-requests" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-slate-700 hover:text-red-600 transition-colors"
            >
              Donation Requests
            </Link>
            
            {user && (
              <Link 
                to="/funding" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-700 hover:text-red-600 transition-colors"
              >
                Funding
              </Link>
            )}

            <div className="h-px bg-slate-100 w-full"></div>

            {!user ? (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-black text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-black text-red-600 hover:text-red-800 transition-colors"
                >
                  Join as Donor
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-700 hover:text-red-600"
                >
                  My Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-lg font-bold text-red-600 text-right"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};




export default Navbar;