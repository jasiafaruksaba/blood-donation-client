import { useEffect, useState } from "react";
import axiosPublic from "../../api/axiosPublic";
import { Link } from "react-router";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axiosPublic.get("/donation-requests").then((res) => {
      const pending = res.data.filter(r => r.status === "pending");
      setRequests(pending);
    });
  }, []);

  return (
    <div className="p-5 grid md:grid-cols-3 gap-5">

      {requests.map((r) => (
        <div key={r._id} className="p-4 bg-white shadow">

          <p><b>{r.recipientName}</b></p>
          <p>{r.district}, {r.upazila}</p>
          <p>{r.bloodGroup}</p>
          <p>{r.date}</p>

          <Link
            to={`/donation/${r._id}`}
            className="btn btn-sm mt-2"
          >
            View
          </Link>

        </div>
      ))}

    </div>
  );
};

export default DonationRequests;