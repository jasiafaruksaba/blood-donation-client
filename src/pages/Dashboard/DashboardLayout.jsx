
import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import useUserRole from "../../hooks/useUserRole";
import { Link } from "react-router";   // ← Added

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role, status } = useUserRole();

  if (status === "blocked") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-4 text-slate-600">Your account has been blocked by Admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white shadow-xl`}>
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow p-4 sticky top-0 z-40 border-b">
          <div className="flex items-center justify-between">
            
            {/* Logo - Clickable to Home */}
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-xl">
                <span className="text-white text-2xl">🩸</span>
              </div>
              <div>
                <span className="text-2xl font-black text-red-600">LifeDrop</span>
              </div>
            </Link>

            {/* Hamburger Menu - Logo এর পাশে */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-3xl text-slate-700 p-1"
            >
              {isSidebarOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;