import { useEffect, useState } from "react";
import axiosPublic from "../../api/axiosPublic"; 
import { Link } from "react-router"; 
import useAuth from "../../hooks/useAuth"; 

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get("/donation-requests");
        const pending = Array.isArray(res.data) ? res.data.filter(r => r.status === "pending") : [];
        setRequests(pending);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Failed to load donation requests");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-red-500 mb-4 block mx-auto"></span>
          <p className="text-lg text-slate-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-red-600 via-red-700 to-orange-600 bg-clip-text text-transparent mb-4">
            Urgent Blood Requests
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Help save lives by responding to these urgent donation requests
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${requests.length === 0 ? 'min-h-[40vh]' : ''}`}>
          {requests.length > 0 ? (
            requests.map((r) => (
              <div key={r._id} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 hover:border-red-200 hover:bg-white">
                <div className="text-4xl mb-4 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {r.bloodGroup}
                </div>
                
                <h3 className="font-black text-2xl text-slate-900 mb-2 truncate">{r.recipientName}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-red-500">📍</span>
                    <span className="font-semibold">{r.district}, {r.upazila}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-orange-500">📅</span>
                    <span>{new Date(r.date).toLocaleDateString('bn-BD')}</span>
                  </div>
                  {r.contactNumber && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="text-green-500">📞</span>
                      <span>{r.contactNumber}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/donation-requests/${r._id}`} // ✅ Fixed route
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all group-hover:scale-[1.02] block text-center"
                >
                  View Details & Help
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-6 mx-auto w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center">
                🩸
              </div>
              <h3 className="text-3xl font-black text-slate-500 mb-4">No Urgent Requests</h3>
              <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
                No pending blood donation requests right now. Check back later!
              </p>
              {user && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                >
                  🏠 Go to Dashboard
                </Link>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-xl">
            <p className="font-semibold">⚠️ {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;