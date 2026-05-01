import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router"; 
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole"; 
import Swal from "sweetalert2";

const DonationDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { role, status, loading: roleLoading, isVolunteer, isAdmin } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id || authLoading || roleLoading) return;
      
      setPageLoading(true);
      try {
        console.log(" Fetching request ID:", id);
        const res = await axiosSecure.get(`/donation-requests/${id}`);
        console.log(" Request found:", res.data);
        setRequest(res.data);
      } catch (err) {
        console.error(" Fetch failed:", err.response?.data);
        // Fallback for Volunteer/Admin
        if (isVolunteer || isAdmin) {
          try {
            const allRes = await axiosSecure.get("/donation-requests");
            const found = Array.isArray(allRes.data?.requests)
              ? allRes.data.requests.find(r => r._id?.toString() === id)
              : null;
            setRequest(found);
          } catch (fallbackErr) {
            console.error("Fallback failed:", fallbackErr);
          }
        }
        if (!request) {
          Swal.fire("Error", "Request not found", "error");
          navigate("/dashboard");
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchRequest();
  }, [id, axiosSecure, navigate, authLoading, roleLoading, isVolunteer, isAdmin]);

  const handleDonate = async () => {
    //  Assignment অনুযায়ী: শুধু Volunteer/Admin donate করতে পারবে
    if (!user) {
      Swal.fire("Login Required", "Please login first", "warning");
      navigate("/login");
      return;
    }

    if (status !== "active") {
      Swal.fire("Blocked", "Your account is blocked", "error");
      return;
    }

    if (!isVolunteer && !isAdmin) {
      Swal.fire(
        "Permission Denied", 
        "Only Volunteers/Admins can accept donations. Contact admin to upgrade your role.", 
        "warning"
      );
      return;
    }

    if (request?.status !== "pending") {
      Swal.fire("Not Available", "This request is already assigned", "info");
      return;
    }

    setLoading(true);
    try {
      console.log(" Donating...", user.displayName);
      const res = await axiosSecure.patch(`/donation-requests/${id}`, {
        status: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      });
      
      console.log(" Donated successfully");
      Swal.fire({
        title: "🎉 Success!",
        text: "You are now assigned to this request!",
        icon: "success",
        timer: 2500,
        showConfirmButton: false
      });
      
      setTimeout(() => {
        setShowModal(false);
        navigate("/dashboard/my-donation-requests");
      }, 2500);
    } catch (err) {
      console.error(" Donate error:", err.response?.data);
      Swal.fire("Error", err.response?.data?.message || "Failed to donate", "error");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold text-slate-900">Loading Request...</h2>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-8">
        <div className="text-center max-w-md mx-auto space-y-6 bg-white rounded-3xl p-12 shadow-2xl">
          <div className="text-6xl mx-auto w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mb-6">ℹ️</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Not Found</h2>
          <p className="text-xl text-slate-700 mb-8">Donation request not found</p>
          <Link to="/dashboard" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const canDonate = isVolunteer || isAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/50 to-orange-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="group inline-flex items-center gap-3 mb-8 p-4 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl border border-slate-200/50 hover:bg-white transition-all hover:-translate-y-1"
        >
          <svg className="w-6 h-6 text-slate-700 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-bold text-lg text-slate-800 group-hover:text-red-600">Back to Dashboard</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 p-8 sm:p-10 lg:p-12 text-white text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 drop-shadow-lg">Urgent Blood Request</h1>
            <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
              <span className="px-6 py-3 bg-white/20 backdrop-blur rounded-2xl font-bold text-xl shadow-lg">{request.bloodGroup}</span>
              <span className="px-6 py-3 bg-white/20 backdrop-blur rounded-2xl font-bold text-xl shadow-lg">{request.recipientName}</span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                request.status === "pending" 
                  ? "bg-yellow-400/30 border-2 border-yellow-400 text-yellow-900" 
                  : "bg-green-400/30 border-2 border-green-400 text-green-900"
              }`}>
                {request.status === "pending" ? "🚨 URGENT" : " ASSIGNED"}
              </span>
            </div>
          </div>

          {/* Details - আপনার original code same রাখুন */}
          <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Recipient & Blood Group */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Recipient</label>
                <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-l-4 border-red-400">
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">{request.recipientName}</h3>
                  <p className="text-lg text-slate-700">{request.hospital}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Blood Group</label>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl shadow-inner">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0">
                    <span className="text-2xl font-black text-white">{request.bloodGroup}</span>
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-red-700">{request.bloodGroup}</h4>
                    <p className="text-lg text-red-600 font-semibold">Urgently needed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location, Date, Time, Address */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Location</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <div><p className="text-lg font-semibold text-slate-800">{request.recipientDistrict}</p><p className="text-sm text-slate-500 uppercase tracking-wide">District</p></div>
                  <div><p className="text-lg font-semibold text-slate-800">{request.recipientUpazila}</p><p className="text-sm text-slate-500 uppercase tracking-wide">Upazila</p></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Date</label><div className="p-6 bg-emerald-50 rounded-2xl text-center border-2 border-emerald-200"><p className="text-2xl font-black text-emerald-800">{request.donationDate}</p><p className="text-sm text-emerald-600 uppercase font-bold tracking-wide mt-1">Donation Date</p></div></div>
                <div><label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Time</label><div className="p-6 bg-blue-50 rounded-2xl text-center border-2 border-blue-200"><p className="text-2xl font-black text-blue-800">{request.donationTime}</p><p className="text-sm text-blue-600 uppercase font-bold tracking-wide mt-1">Donation Time</p></div></div>
              </div>
              <div><label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Full Address</label><div className="p-6 bg-slate-50 rounded-2xl border-l-6 border-orange-400 min-h-[120px] flex items-center"><p className="text-lg leading-relaxed text-slate-800">{request.fullAddress}</p></div></div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="p-8 lg:p-12 border-t border-slate-200 bg-gradient-to-r from-slate-50/50 to-red-50/50">
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">💬 Message from Requester</h3>
              <div className="bg-white/80 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl border border-slate-200 prose prose-lg max-w-none">
                <p className="text-xl lg:text-2xl leading-relaxed text-slate-800 whitespace-pre-wrap">{request.message}</p>
              </div>
            </div>
          )}

          {/* CTA Section - Role ভিত্তিক */}
          {request.status === "pending" && (
            <div className="p-8 lg:p-12 border-t border-slate-200 bg-gradient-to-r from-emerald-50 via-green-50 to-red-50">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                {canDonate ? (
                  //  Volunteer/Admin: Donate Button
                  <>
                    <button
                      onClick={() => setShowModal(true)}
                      className="group relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-red-800 hover:to-orange-700 text-white font-black py-6 px-12 lg:px-16 rounded-3xl text-xl lg:text-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 w-full sm:w-auto overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform origin-center duration-300 rounded-3xl"></div>
                      <span className="relative z-10 flex items-center gap-3">❤️ I Want To Donate</span>
                    </button>
                    <p className="text-sm text-slate-600 font-medium">Confirm to accept this donation request</p>
                  </>
                ) : (
                  // Donor: Permission Denied
                  <div className="p-8 bg-yellow-50 border-2 border-yellow-300 rounded-3xl">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-3xl flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-800 mb-3">Need Volunteer Role</h3>
                    <p className="text-lg text-yellow-700 mb-4">Only Volunteers/Admins can accept donations</p>
                    <p className="text-sm text-yellow-600">Contact Admin to upgrade your role</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal - Volunteer/Admin শুধু */}
        {showModal && canDonate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 max-w-lg w-full mx-4 shadow-2xl border border-white/50">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl text-3xl">❤️</div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Ready to Donate?</h3>
                <p className="text-lg text-slate-700">You'll be assigned as donor for <strong>{request.recipientName}</strong></p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 p-6 bg-slate-50 rounded-2xl">
                <div><label className="text-sm font-bold text-slate-500 block mb-1">Donor Name</label><p className="font-bold text-xl text-slate-900">{user?.displayName}</p></div>
                <div><label className="text-sm font-bold text-slate-500 block mb-1">Blood Group</label><p className="font-bold text-2xl text-red-600">{request.bloodGroup}</p></div>
                <div className="sm:col-span-2"><label className="text-sm font-bold text-slate-500 block mb-1">Email</label><p className="font-semibold text-lg text-slate-900">{user?.email}</p></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 px-8 border-2 border-slate-300 rounded-2xl font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-sm text-lg">Cancel</button>
                <button onClick={handleDonate} disabled={loading} className="flex-1 py-4 px-8 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg disabled:opacity-50 flex items-center justify-center gap-3">
                  {loading ? (<><span className="loading loading-spinner loading-sm w-6 h-6"></span>Confirming...</>) : "Confirm & Donate"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationDetails;