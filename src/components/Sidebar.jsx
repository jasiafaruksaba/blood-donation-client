import { Link } from "react-router";
import useUserRole from "../hooks/useUserRole";

const Sidebar = () => {
  const { role } = useUserRole();

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-5">Dashboard</h2>

      <ul className="space-y-3">

        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/dashboard/profile">Profile</Link></li>

        {/* Donor */}
        {role === "donor" && (
          <>
            <li><Link to="/dashboard/create-donation-request">Create Request</Link></li>
            <li><Link to="/dashboard/my-donation-requests">My Requests</Link></li>
          </>
        )}

        {/* Admin */}
        {role === "admin" && (
          <>
            <li><Link to="/dashboard/all-users">All Users</Link></li>
            <li><Link to="/dashboard/all-blood-donation-request">All Requests</Link></li>
          </>
        )}

        {/* Volunteer */}
        {role === "volunteer" && (
          <>
            <li><Link to="/dashboard/all-blood-donation-request">All Requests</Link></li>
          </>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;