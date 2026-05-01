import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const fetchRequests = async () => {
    try {
      let url = `/donation-requests/my/${user.email}?page=${currentPage}&limit=${limit}`;
      if (filter !== "all") url += `&status=${filter}`;

      const res = await axiosSecure.get(url);
      setRequests(res.data.requests || res.data);
      setTotalPages(res.data.totalPages || Math.ceil((res.data.length || 0) / limit));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.email) fetchRequests();
  }, [user, filter, currentPage]);

  const updateStatus = async (id, newStatus) => {
    if (!confirm(`Mark as ${newStatus}?`)) return;
    await axiosSecure.patch(`/donation-requests/${id}`, { status: newStatus });
    fetchRequests();
  };

  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;
    await axiosSecure.delete(`/donation-requests/${id}`);
    fetchRequests();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">My Donation Requests</h2>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
          className="px-5 py-2.5 border rounded-2xl"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Recipient</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Blood Group</th>
              <th className="p-4 text-left">Date & Time</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium">{req.recipientName}</td>
                <td className="p-4">{req.recipientDistrict}, {req.recipientUpazila}</td>
                <td className="p-4 font-bold text-red-600">{req.bloodGroup}</td>
                <td className="p-4">{req.donationDate} at {req.donationTime}</td>
                <td className="p-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                    req.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    req.status === "inprogress" ? "bg-blue-100 text-blue-700" :
                    req.status === "done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  {req.status === "inprogress" && (
                    <>
                      <button onClick={() => updateStatus(req._id, "done")} className="btn btn-success btn-sm">Done</button>
                      <button onClick={() => updateStatus(req._id, "canceled")} className="btn btn-error btn-sm">Cancel</button>
                    </>
                  )}
                  <button onClick={() => deleteRequest(req._id)} className="btn btn-error btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-5 py-2 rounded-xl ${currentPage === page ? 'bg-red-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;