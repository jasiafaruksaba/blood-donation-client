import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";

const DonationDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    axiosSecure.get("/donation-requests").then((res) => {
      const found = res.data.find((r) => r._id === id);
      setData(found);
    });
  }, [id]);

  const handleDonate = async () => {
    await axiosSecure.patch(`/donation-requests/${id}`, {
      status: "inprogress",
      donorName: user.displayName,
      donorEmail: user.email,
    });

    alert("Donation Confirmed");
  };

  return (
    <div className="p-5 max-w-xl mx-auto bg-white shadow">

      <h2 className="text-xl font-bold mb-3">
        {data.recipientName}
      </h2>

      <p>{data.district}, {data.upazila}</p>
      <p>{data.bloodGroup}</p>
      <p>{data.date} - {data.time}</p>
      <p>{data.message}</p>

      <button
        onClick={handleDonate}
        className="btn btn-primary mt-3"
      >
        Donate
      </button>

    </div>
  );
};

export default DonationDetails;