import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; 
import useUserRole from "../../../hooks/useUserRole"; 

const AllRequests = () => {
  const axiosSecure = useAxiosSecure(); 
  const { role } = useUserRole();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/donation-requests");
      setRequests(Array.isArray(res.data) ? res.data : res.data.requests || []);
    } catch (err) {
      console.error("❌ Requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [axiosSecure]);

  const updateStatus = async (id, status, donorInfo = {}) => {
    if (!confirm(`Mark as ${status}?`)) return;
    
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, { 
        status, 
        donorName: donorInfo.donorName || "Volunteer",
        donorEmail: donorInfo.donorEmail || "volunteer@lifedrop.com"
      });
      fetchRequests();
      alert(`✅ Marked as ${status}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update");
    }
  };

  const filteredRequests = requests.filter(r => 
    filter === "all" || r.status === filter
  );

  const canManage = role === "admin" || role === "volunteer";

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <h2 className="text-3xl font-black text-slate-900">
          All Blood Donation Requests ({filteredRequests.length})
        </h2>
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full lg:w-auto"
        >
          <option value="all">All Status ({requests.length})</option>
          <option value="pending">⏳ Pending</option>
          <option value="inprogress">🔄 In Progress</option>
          <option value="done">✅ Done</option>
          <option value="canceled">❌ Canceled</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
            <span className="text-5xl">🩸</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-500 mb-2">No requests found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {filter === "all" ? "No donation requests yet." : `No ${filter} requests.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-slate-50">
                <th>Requester</th>
                <th>Recipient</th>
                <th>Blood Group</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover">
                  <td className="font-semibold">{req.requesterName}</td>
                  <td>{req.recipientName}</td>
                  <td>
                    <span className="badge badge-lg badge-error gap-2">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td>
                    <div className="font-medium">{req.donationDate}</div>
                    <div className="text-sm text-slate-500">{req.donationTime}</div>
                  </td>
                  <td>
                    <div className="font-medium">{req.recipientDistrict}</div>
                    <div className="text-sm">{req.recipientUpazila}</div>
                  </td>
                  <td>
                    <span className={`badge badge-lg gap-2 ${
                      req.status === "pending" ? "badge-warning" :
                      req.status === "inprogress" ? "badge-info" :
                      req.status === "done" ? "badge-success" : "badge-error"
                    }`}>
                      {req.status?.toUpperCase()}
                    </span>
                    {req.donorName && (
                      <div className="text-xs mt-1 text-slate-600">
                        👤 {req.donorName}
                      </div>
                    )}
                  </td>
                  {canManage && (
                    <td>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {req.status === "pending" && (
                          <button 
                            onClick={() => updateStatus(req._id, "inprogress")}
                            className="btn btn-primary btn-sm"
                          >
                            Assign
                          </button>
                        )}
                        {req.status === "inprogress" && (
                          <>
                            <button 
                              onClick={() => updateStatus(req._id, "done")}
                              className="btn btn-success btn-sm"
                            >
                              Done
                            </button>
                            <button 
                              onClick={() => updateStatus(req._id, "canceled")}
                              className="btn btn-error btn-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRequests;