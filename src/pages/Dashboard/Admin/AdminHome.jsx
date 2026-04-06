import { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    axiosSecure.get("/users").then(res => setUsers(res.data));
    axiosSecure.get("/donation-requests").then(res => setRequests(res.data));
    axiosSecure.get("/payments").then(res => setFunds(res.data));
  }, []);

  const totalFunding = funds.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="grid md:grid-cols-3 gap-5">

      <div className="bg-white p-5 shadow text-center">
        <h2 className="text-2xl font-bold">{users.length}</h2>
        <p>Total Users</p>
      </div>

      <div className="bg-white p-5 shadow text-center">
        <h2 className="text-2xl font-bold">${totalFunding}</h2>
        <p>Total Funding</p>
      </div>

      <div className="bg-white p-5 shadow text-center">
        <h2 className="text-2xl font-bold">{requests.length}</h2>
        <p>Total Requests</p>
      </div>

    </div>
  );
};

export default AdminHome;