import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link, useNavigate } from "react-router";
import {
  FaUsers,
  FaHeartbeat,
  FaDollarSign,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlusCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHome = () => {
  const { user, logOut } = useAuth();
  const { role, loading: roleLoading, status } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalFunding: 0,
    pendingRequests: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (roleLoading || !role || !user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {

        const profileRes = await axiosSecure.get("/users/me").catch(() => ({}));
        setProfile(profileRes.data);
        if (role === "donor") {
          //  DONOR: Only their own recent 3 requests
          const res = await axiosSecure.get(`/donation-requests/my/${user.email}?limit=3`);
          setRecentRequests(res.data.requests || []);
        } else {
          //  ADMIN/VOLUNTEER: Full stats
          const [usersRes, requestsRes, paymentsRes] = await Promise.all([
            axiosSecure.get("/users").catch(() => ({ data: { users: [] } })),
            axiosSecure.get("/donation-requests").catch(() => ({ data: { requests: [] } })),
            axiosSecure.get("/payments").catch(() => ({ data: { payments: [] } }))
          ]);

          const allUsers = usersRes.data.users || [];
          const allRequests = requestsRes.data.requests || [];
          const allPayments = paymentsRes.data.payments || [];

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

  // ✅ Delete Request Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    setDeletingId(id);
    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      setRecentRequests(prev => prev.filter(req => req._id !== id));
      alert("Request deleted successfully!");
    } catch (err) {
      alert("Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Status Update Handler
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}/status`, { status: newStatus });
      setRecentRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Loading State
  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-600">Loading Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Blocked User Check
  if (status === "blocked") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-red-600 mb-4">Access Blocked</h2>
          <p className="text-lg text-slate-600 mb-8">Your account has been blocked by Admin.</p>
          <button
            onClick={logOut}
            className="btn btn-outline btn-error w-full"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 space-y-8 p-4 sm:p-6 lg:p-8">
      {/* 🎉 Welcome Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-red-900 to-orange-700 bg-clip-text text-transparent mb-4 leading-tight">
              Welcome Back,
              <br />
              <span className="text-5xl lg:text-7xl">{profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Hero'}</span>
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {role === 'donor' ? "👤 Your recent donation requests" :
                role === 'admin' ? "🌐 Full platform control at your fingertips" :
                  "🤝 Manage blood donation requests"}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/dashboard/create-donation-request"
              className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <FaPlusCircle className="mr-2" /> New Request
            </Link>
            {role === 'admin' && (
              <Link to="/dashboard/all-users" className="btn btn-outline btn-accent btn-lg">
                Manage Users
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* 🔥 Role-based Content */}
      <AnimatePresence mode="wait">
        {role === "donor" ? (
          <motion.div
            key="donor"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            {/* 📋 Recent Requests Table */}
            {recentRequests.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
              >
                <div className="p-8 border-b border-slate-200">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
                    <FaClock className="w-8 h-8" />
                    Recent 3 Requests
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-50 to-orange-50">
                        <th>Recipient</th>
                        <th>Location</th>
                        <th>Date & Time</th>
                        <th>Blood Group</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((request) => (
                        <motion.tr
                          key={request._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="hover:bg-red-50/50 transition-all duration-200 border-b border-slate-100"
                        >
                          <td className="font-semibold">{request.recipientName}</td>
                          <td>
                            <div>
                              <div className="font-medium">{request.recipientDistrict}</div>
                              <div className="text-sm text-slate-500">{request.recipientUpazila}</div>
                            </div>
                          </td>
                          <td>
                            <div>{new Date(request.donationDate).toLocaleDateString()}</div>
                            <div className="text-sm text-slate-500">{request.donationTime}</div>
                          </td>
                          <td>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                              {request.bloodGroup}
                            </span>
                          </td>
                          <td>
                            {request.status === 'pending' && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                Pending
                              </span>
                            )}
                            {request.status === 'inprogress' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                In Progress
                              </span>
                            )}
                            {request.status === 'done' && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                Done
                              </span>
                            )}
                            {request.status === 'cancelled' && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="flex gap-2">
                            <Link
                              to={`/dashboard/donation-request/${request._id}`}
                              className="btn btn-ghost btn-xs"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                            {request.status === 'inprogress' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(request._id, 'done')}
                                  className="btn btn-success btn-xs"
                                  title="Mark as Done"
                                >
                                  <FaCheckCircle />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(request._id, 'cancelled')}
                                  className="btn btn-error btn-xs"
                                  title="Cancel"
                                >
                                  <FaTimesCircle />
                                </button>
                              </>
                            )}
                            <Link
                              to={`/dashboard/edit-donation-request/${request._id}`}
                              className="btn btn-warning btn-xs"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(request._id)}
                              disabled={deletingId === request._id}
                              className="btn btn-error btn-xs"
                              title="Delete"
                            >
                              {deletingId === request._id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-8 bg-gradient-to-r from-red-50 to-orange-50 border-t border-slate-200">
                  <Link
                    to="/dashboard/my-donation-requests"
                    className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 flex items-center gap-2 mx-auto"
                  >
                    <FaFileInvoiceDollar />
                    View All My Requests
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 text-center shadow-2xl border border-white/50"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FaHeartbeat className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No Requests Yet</h3>
                <p className="text-lg text-slate-600 mb-8">Create your first blood donation request to help someone in need.</p>
                <Link
                  to="/dashboard/create-donation-request"
                  className="btn btn-primary btn-lg shadow-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  Create First Request
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // 🔥 ADMIN/VOLUNTEER Dashboard
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 xl:col-span-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {/* Total Users */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <FaUsers className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{stats.totalUsers.toLocaleString()}</h3>
                  <p className="text-slate-600 font-semibold text-lg">Total Users</p>
                  <p className="text-sm text-green-600 font-medium mt-1">+12% this month</p>
                </motion.div>

                {/* Total Requests */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <FaHeartbeat className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{stats.totalRequests.toLocaleString()}</h3>
                  <p className="text-slate-600 font-semibold text-lg">Total Requests</p>
                  <p className="text-sm text-orange-600 font-medium mt-1">{stats.pendingRequests} pending</p>
                </motion.div>

                {/* Total Funding */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <FaDollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">
                    ৳{stats.totalFunding.toLocaleString()}
                  </h3>
                  <p className="text-slate-600 font-semibold text-lg">Total Funding</p>
                  <p className="text-sm text-emerald-600 font-medium mt-1">+25% growth</p>
                </motion.div>

                {/* Active Users */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <FaUsers className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{stats.activeUsers.toLocaleString()}</h3>
                  <p className="text-slate-600 font-semibold text-lg">Active Users</p>
                  <p className="text-sm text-purple-600 font-medium mt-1">Real-time</p>
                </motion.div>

                {/* Quick Action Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer col-span-2 md:col-span-1"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black">Quick Actions</h3>
                    <FaPlusCircle className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Link to="/dashboard/all-blood-donation-request" className="flex items-center gap-2 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all">
                      <FaHeartbeat className="w-5 h-5" /> All Requests
                    </Link>
                    <Link to="/dashboard/funding" className="flex items-center gap-2 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all">
                      <FaDollarSign className="w-5 h-5" /> Funding
                    </Link>
                    {role === 'admin' && (
                      <>
                        <Link to="/dashboard/all-users" className="flex items-center gap-2 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all">
                          <FaUsers className="w-5 h-5" /> Manage Users
                        </Link>
                        <Link to="/dashboard/all-blood-donation-request" className="flex items-center gap-2 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all">
                          <FaClock className="w-5 h-5" /> Pending Requests
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHome;