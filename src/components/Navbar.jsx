import { Link, useNavigate, useLocation } from "react-router"; 
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20 relative">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group p-2 -m-2 rounded-xl hover:bg-red-50 transition-all duration-300 shrink-0"
            onClick={closeMobileMenu}
          >
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl group-hover:bg-red-500/20 transition-all">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <span className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-red-600 via-red-700 to-orange-600 bg-clip-text text-transparent tracking-tight leading-tight">
                LifeDrop
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium block lg:hidden">Blood Donation</span>
            </div>
          </Link>

          {/* Desktop Nav - Only lg+ */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Donation Requests */}
            <Link 
              to="/donation-requests" 
              className={`relative px-7 py-3 font-semibold text-base rounded-2xl transition-all duration-300 group hover:scale-[1.05] shadow-lg hover:shadow-xl overflow-hidden ${
                isActive('/donation-requests') 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-500/50 ring-2 ring-red-400/50' 
                  : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 hover:from-red-50 hover:to-orange-50 hover:text-red-700 hover:shadow-red-200/50 border hover:border-red-200'
              }`}
              onClick={closeMobileMenu}
            >
              <span className="relative z-10">Requests</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            {/* Funding */}
            {user && (
              <Link 
                to="/funding" 
                className={`relative px-7 py-3 font-semibold text-base rounded-2xl transition-all duration-300 group hover:scale-[1.05] shadow-lg hover:shadow-xl overflow-hidden ${
                  isActive('/funding') 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50 ring-2 ring-emerald-400/50' 
                    : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-700 hover:shadow-emerald-200/50 border hover:border-emerald-200'
                }`}
                onClick={closeMobileMenu}
              >
                <span className="relative z-10">Funding</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            <div className="h-12 w-px bg-gradient-to-b from-slate-200 to-slate-300 mx-6"></div>

            {/* Desktop Auth */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group-hover:shadow-xl">
                  <img 
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=ef4444&color=fff&size=44&bold=true`} 
                    alt="Profile" 
                    className="w-11 h-11 rounded-full object-cover border-3 border-white shadow-lg ring-2 ring-slate-100/50" 
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-900 leading-tight">
                      {user.displayName?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[100px]">
                      {user.email}
                    </p>
                  </div>
                </button>

                {/* Desktop Dropdown */}
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=ef4444&color=fff&size=44`} className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-xl"/>
                      <div>
                        <p className="font-black text-lg text-slate-900">{user.displayName}</p>
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="block px-5 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-bold rounded-xl transition-all mx-2 my-2" onClick={closeMobileMenu}>Dashboard</Link>
                  <Link to="/dashboard/profile" className="block px-5 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 font-bold rounded-xl transition-all mx-2 my-2" onClick={closeMobileMenu}>Profile</Link>
                  <hr className="border-slate-100 mx-3" />
                  <button onClick={handleLogout} className="w-full text-left px-5 py-4 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all mx-2 my-2">Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.97]" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="px-7 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-sm rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.97]" onClick={closeMobileMenu}>
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet - Profile + Hamburger (No dropdown on profile) */}
          <div className="flex items-center lg:hidden">
            {/* Profile Avatar - NO DROPDOWN, just visual */}
            {user && (
              <div className="mr-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all">
                <img 
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=ef4444&color=fff&size=36&bold=true`} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-lg cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all"
                  title={user.displayName || 'User'}
                />
                {/* Tiny name below avatar */}
                <p className="text-xs font-semibold text-slate-700 text-center mt-1 truncate max-w-[80px] leading-tight px-1">
                  {user.displayName?.split(' ')[0]?.slice(0,6) || 'User'}
                </p>
              </div>
            )}
            
            {/* Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-all shadow-sm"
              aria-label="Toggle menu"
            >
              <svg className={`w-6 h-6 transition-all ${isMobileMenuOpen ? 'text-red-600 rotate-180' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - All options here */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-2xl z-40">
          <div className="max-w-md mx-auto px-6 py-8">
            <div className="space-y-4">
              
              {/* Requests */}
              <Link 
                to="/donation-requests" 
                className={`block w-full p-6 rounded-3xl text-center font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] ${
                  isActive('/donation-requests') 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white ring-2 ring-red-400/50 shadow-red-500/25' 
                    : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 hover:from-red-50 hover:to-orange-50 hover:text-red-700 hover:shadow-red-200/50 border hover:border-red-200'
                }`}
                onClick={closeMobileMenu}
              >
                Donation Requests
              </Link>

              {/* Funding */}
              {user && (
                <Link 
                  to="/funding" 
                  className={`block w-full p-6 rounded-3xl text-center font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] ${
                    isActive('/funding') 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white ring-2 ring-emerald-400/50 shadow-emerald-500/25' 
                      : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-700 hover:shadow-emerald-200/50 border hover:border-emerald-200'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Funding
                </Link>
              )}

              <div className="h-px bg-gradient-to-r from-slate-200 via-transparent to-slate-200 my-6"></div>

              {/* Auth/Dashboard */}
              {!user ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to="/login" 
                    className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="p-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
                    onClick={closeMobileMenu}
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link 
                    to="/dashboard" 
                    className={`block w-full p-6 rounded-3xl text-center font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
                      isActive('/dashboard') 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white ring-2 ring-blue-400/50 shadow-blue-500/25' 
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-800 hover:from-blue-100 hover:to-indigo-100 hover:text-blue-700 hover:shadow-blue-200/50 border hover:border-blue-200'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/profile" 
                    className={`block w-full p-6 rounded-3xl text-center font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
                      isActive('/dashboard/profile') 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-2 ring-purple-400/50 shadow-purple-500/25' 
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 text-slate-800 hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 hover:shadow-purple-200/50 border hover:border-purple-200'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full p-6 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-2 border-red-200 text-red-700 font-bold text-lg rounded-3xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;