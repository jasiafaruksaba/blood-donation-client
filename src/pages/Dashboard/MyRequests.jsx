import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/donation-requests/my/${user.email}`)
        .then((res) => setRequests(res.data));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (confirm("Delete this request?")) {
      await axiosSecure.delete(`/donation-requests/${id}`);
      setRequests(requests.filter((r) => r._id !== id));
    }
  };

  const handleStatus = async (id, status) => {
    await axiosSecure.patch(`/donation-requests/${id}`, { status });

    setRequests(
      requests.map((r) =>
        r._id === id ? { ...r, status } : r
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">My Requests</h2>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Location</th>
            <th>Date</th>
            <th>Blood</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.recipientName}</td>
              <td>{r.district}, {r.upazila}</td>
              <td>{r.date}</td>
              <td>{r.bloodGroup}</td>
              <td>{r.status}</td>

              <td className="space-x-2">

                {r.status === "inprogress" && (
                  <>
                    <button
                      onClick={() => handleStatus(r._id, "done")}
                      className="btn btn-success btn-xs"
                    >
                      Done
                    </button>

                    <button
                      onClick={() => handleStatus(r._id, "canceled")}
                      className="btn btn-error btn-xs"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(r._id)}
                  className="btn btn-error btn-xs"
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyRequests;