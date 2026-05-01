
import { Link, useLocation } from "react-router";
import useUserRole from "../hooks/useUserRole";

const Sidebar = ({ setIsSidebarOpen }) => {
  const { role } = useUserRole();
  const location = useLocation();

  const isActive = (path) => location.pathname === path 
    ? "bg-red-50 text-red-600 font-bold border-r-4 border-red-600" 
    : "hover:bg-slate-100";

  return (
    <div className="w-64 h-screen bg-white shadow-xl p-6 overflow-y-auto">
      
      {/* Logo - Clickable to Home */}
      <Link 
        to="/" 
        className="flex items-center gap-3 mb-10 group"
        onClick={() => setIsSidebarOpen(false)}
      >
        <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
          🩸
        </div>
        <div>
          <span className="text-3xl font-black text-slate-900">LifeDrop</span>
          <p className="text-xs text-slate-500 -mt-1">Blood Donation</p>
        </div>
      </Link>

      <nav className="space-y-1">
        <Link 
          to="/dashboard" 
          className={`block px-5 py-3.5 rounded-2xl ${isActive('/dashboard')}`} 
          onClick={() => setIsSidebarOpen(false)}
        >
          🏠 Dashboard Home
        </Link>

        <Link 
          to="/dashboard/profile" 
          className={`block px-5 py-3.5 rounded-2xl ${isActive('/dashboard/profile')}`} 
          onClick={() => setIsSidebarOpen(false)}
        >
          👤 My Profile
        </Link>

        {/* Donor Routes */}
        {role === "donor" && (
          <>
            <Link 
              to="/dashboard/create-donation-request" 
              className={`block px-5 py-3.5 rounded-2xl ${isActive('/dashboard/create-donation-request')}`} 
              onClick={() => setIsSidebarOpen(false)}
            >
              🆕 Create Request
            </Link>
            <Link 
              to="/dashboard/my-donation-requests" 
              className={`block px-5 py-3.5 rounded-2xl ${isActive('/dashboard/my-donation-requests')}`} 
              onClick={() => setIsSidebarOpen(false)}
            >
              🩸 My Requests
            </Link>
          </>
        )}

        {/* Volunteer & Admin */}
        {(role === "volunteer" || role === "admin") && (
          <Link 
            to="/dashboard/all-blood-donation-request" 
            className={`block px-5 py-3.5 rounded-2xl ${isActive('/dashboard/all-blood-donation-request')}`} 
            onClick={() => setIsSidebarOpen(false)}
          >
            📋 All Donation Requests
          </Link>
        )}

        {/* Admin Only */}
        {role === "admin" && (
          <Link 
            to="/dashboard/all-users" 
            className={`block px-5 py-3.5 rounded-2xl ${isActive('/dashboard/all-users')}`} 
            onClick={() => setIsSidebarOpen(false)}
          >
            👥 All Users
          </Link>
        )}

        <Link 
          to="/dashboard/funding" 
          className={`block px-5 py-3.5 rounded-2xl hover:bg-slate-100`} 
          onClick={() => setIsSidebarOpen(false)}
        >
          💰 Funding
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;