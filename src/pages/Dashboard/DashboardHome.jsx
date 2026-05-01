import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router"; 

const DashboardHome = () => {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();   
  const axiosSecure = useAxiosSecure();

  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalRequests: 0, 
    totalFunding: 0,
    pendingRequests: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleLoading || !role || !user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (role === "donor") {
          // Donor: Recent requests
          try {
            const res = await axiosSecure.get(`/donation-requests/my/${user.email}?limit=3&sort=-createdAt`);
            setRecentRequests(Array.isArray(res.data) ? res.data : []);
          } catch (err) {
            console.log("No requests for donor:", err);
            setRecentRequests([]);
          }
        } else {
          // Admin/Volunteer: Fetch ALL data with fallback
          const [usersRes, requestsRes, paymentsRes] = await Promise.all([
            // ✅ Users - direct count fallback
            axiosSecure.get("/users").catch(() => ({ data: [] })),
            // ✅ Requests - direct count fallback  
            axiosSecure.get("/donation-requests").catch(() => ({ data: [] })),
            // ✅ Payments - direct count fallback
            axiosSecure.get("/payments").catch(() => ({ data: [] }))
          ]);

          // ✅ Calculate stats manually (no stats endpoint needed)
          const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
          const allRequests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
          const allPayments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];

          setStats({
            totalUsers: allUsers.length,
            totalRequests: allRequests.length,
            totalFunding: allPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
            pendingRequests: allRequests.filter(r => r.status === "pending").length,
            activeUsers: allUsers.filter(u => u.status === "active").length
          });
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, roleLoading, user?.email, axiosSecure]);

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-red-600 mb-4"></div>
          <p className="text-xl text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50/50 to-red-50/20">
      
      {/* Welcome Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 bg-clip-text text-transparent mb-4 leading-tight">
            Welcome Back,
          </h1>
          <span className="block text-3xl lg:text-5xl bg-gradient-to-r from-red-600 via-orange-500 to-red-700 bg-clip-text text-transparent font-black px-6 py-3 rounded-3xl bg-white/50 shadow-xl inline-block">
            {user?.displayName?.split(' ')[0] || 'Admin'}
          </span>
          <p className="text-xl lg:text-2xl text-slate-600 mt-6 max-w-2xl mx-auto lg:mx-0">
            {role === 'admin' 
              ? "Complete platform control. Manage users, requests & funding." 
              : "Monitor all blood donation requests & platform stats."
            }
          </p>
        </div>
      </div>

      {/* DONOR: Recent Requests */}
      {role === "donor" && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div className="p-8 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Recent Requests</h2>
                <p className="text-slate-600">{recentRequests.length} requests found</p>
              </div>
              <Link 
                to="/dashboard/my-donation-requests" 
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 whitespace-nowrap"
              >
                📋 View All Requests
              </Link>
            </div>
          </div>

          {recentRequests.length === 0 ? (
            <div className="p-16 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-6xl mb-6 mx-auto">🩸</div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">No requests yet</h3>
              <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
                Create your first blood donation request to help someone in need.
              </p>
              <Link 
                to="/dashboard/create-donation-request"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-5 rounded-3xl font-bold text-xl hover:from-red-700 hover:to-red-800 shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2"
              >
                🆕 Create First Request
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Blood Group</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-red-50/50">
                      <td>
                        <div className="font-bold">{req.recipientName}</div>
                        <div className="text-sm text-slate-600">{req.hospital}</div>
                      </td>
                      <td>
                        <div className="font-medium">{req.recipientDistrict}</div>
                        <div className="text-sm">{req.recipientUpazila}</div>
                      </td>
                      <td>
                        <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full text-sm shadow-md">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="font-medium">
                        <div>{req.donationDate}</div>
                        <div className="text-sm text-slate-500">{req.donationTime}</div>
                      </td>
                      <td>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold text-white shadow-sm ${
                          req.status === "pending" ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                          req.status === "inprogress" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                          req.status === "done" ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                          "bg-gradient-to-r from-rose-500 to-red-600"
                        }`}>
                          {req.status?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/dashboard/donation-request-details/${req._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADMIN/VOLUNTEER: Stats Cards */}
      {(role === "admin" || role === "volunteer") && (
        <>
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat stat-card bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl">
              <div className="stat-figure text-3xl opacity-75">🩸</div>
              <div className="stat-title">Pending Requests</div>
              <div className="stat-value text-3xl font-black">{stats.pendingRequests}</div>
            </div>
            <div className="stat stat-card bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl">
              <div className="stat-figure text-3xl opacity-75">👥</div>
              <div className="stat-title">Active Users</div>
              <div className="stat-value text-3xl font-black">{stats.activeUsers}</div>
            </div>
            <div className="stat stat-card bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-3xl shadow-2xl">
              <div className="stat-figure text-3xl opacity-75">📊</div>
              <div className="stat-title">Total Requests</div>
              <div className="stat-value text-3xl font-black">{stats.totalRequests}</div>
            </div>
            <div className="stat stat-card bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-3xl shadow-2xl">
              <div className="stat-figure text-3xl opacity-75">💰</div>
              <div className="stat-title">Total Funding</div>
              <div className="stat-value text-3xl font-black">
                ৳{stats.totalFunding.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Main Stats Cards with Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Users Card */}
            <Link to="/dashboard/all-users" className="group">
              <div className="group bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 p-10 rounded-3xl text-white shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-white/30 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl mb-6 mx-auto w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                  👥
                </div>
                <div className="relative z-10 text-center space-y-3">
                  <p className="text-5xl lg:text-6xl font-black mb-2">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold mb-4">Total Users</p>
                  <p className="text-white/90 text-lg">Donors + Volunteers + Admins</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2 justify-center">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-xs font-bold">Active: {stats.activeUsers}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Requests Card */}
            <Link to="/dashboard/all-blood-donation-request" className="group">
              <div className="group bg-gradient-to-br from-red-500 via-orange-500 to-red-600 p-10 rounded-3xl text-white shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-white/30 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl mb-6 mx-auto w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                  🩸
                </div>
                <div className="relative z-10 text-center space-y-3">
                  <p className="text-5xl lg:text-6xl font-black mb-2">
                    {stats.totalRequests.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold mb-4">Blood Requests</p>
                  <p className="text-white/90 text-lg">All statuses included</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2 justify-center">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-xs font-bold bg-red-500/30">Pending: {stats.pendingRequests}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Funding Card */}
            <Link to="/dashboard/funding" className="group">
              <div className="group bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-10 rounded-3xl text-white shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-white/30 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl mb-6 mx-auto w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                  💰
                </div>
                <div className="relative z-10 text-center space-y-3">
                  <p className="text-5xl lg:text-6xl font-black mb-2">
                    ৳{stats.totalFunding.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold mb-4">Total Funding</p>
                  <p className="text-white/90 text-lg">Community donations</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <Link to="/dashboard/all-users" className="group p-10 bg-white/80 backdrop-blur-xl rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-200 hover:border-red-300 text-center">
              <div className="text-5xl mb-6 mx-auto group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Manage Users</h3>
              <p className="text-slate-600 mb-6">Block/unblock, promote to admin/volunteer</p>
              <div className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all">
                Go to Users →
              </div>
            </Link>
            
            <Link to="/dashboard/all-blood-donation-request" className="group p-10 bg-white/80 backdrop-blur-xl rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-200 hover:border-blue-300 text-center">
              <div className="text-5xl mb-6 mx-auto group-hover:scale-110 transition-transform">🩸</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">All Requests</h3>
              <p className="text-slate-600 mb-6">{stats.pendingRequests} pending requests</p>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all">
                Manage Requests →
              </div>
            </Link>
            
            <Link to="/dashboard/funding" className="group p-10 bg-white/80 backdrop-blur-xl rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-200 hover:border-emerald-300 text-center">
              <div className="text-5xl mb-6 mx-auto group-hover:scale-110 transition-transform">💰</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Funding</h3>
              <p className="text-slate-600 mb-6">View donations & contribute</p>
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all">
                View Funding →
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;