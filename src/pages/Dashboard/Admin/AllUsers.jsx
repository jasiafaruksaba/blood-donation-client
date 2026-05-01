import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; 
import useUserRole from "../../../hooks/useUserRole"; 

const AllUsers = () => {
  const axiosSecure = useAxiosSecure(); 
  const { role } = useUserRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (role !== "admin") return; // ✅ Admin only
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/users?status=${filterStatus}`);
        setUsers(res.data.users || res.data || []);
      } catch (err) {
        console.error("Users fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [axiosSecure, filterStatus, role]);

  const handleAction = async (email, action, value) => {
    if (!confirm(`Are you sure? ${action} → ${value}`)) return;
    
    try {
      await axiosSecure.patch(`/users/${email}`, { [action]: value });
      
      setUsers(prev =>
        prev.map(user => 
          user.email === email 
            ? { ...user, [action]: value }
            : user
        )
      );
      
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} updated to ${value}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user");
    }
  };

  if (role !== "admin") {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Admin Access Required</h2>
          <p className="text-slate-600">Only admins can view all users</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-[400px] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-red-600"></span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-3xl font-black text-slate-900">All Users ({users.length})</h2>
        
        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.email}>
                <td>
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img 
                        src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=ef4444&color=fff"} 
                        alt={user.name} 
                      />
                    </div>
                  </div>
                </td>
                <td className="font-bold">{user.name}</td>
                <td className="font-mono text-sm">{user.email}</td>
                <td>
                  <span className={`badge badge-lg gap-2 ${
                    user.role === "admin" ? "badge-primary" :
                    user.role === "volunteer" ? "badge-secondary" : "badge-accent"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-lg gap-2 ${
                    user.status === "active" ? "badge-success" : "badge-error"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="text-sm">
                  <div>{user.district || "-"}</div>
                  <div className="text-xs opacity-75">{user.upazila || "-"}</div>
                  <div className="text-xs font-mono text-slate-500">{user.bloodGroup || "-"}</div>
                </td>
                <td>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-sm btn-circle btn-ghost">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button
                          onClick={() => handleAction(user.email, "status", 
                            user.status === "active" ? "blocked" : "active"
                          )}
                          className={`${
                            user.status === "active" ? "btn-error" : "btn-success"
                          } btn-xs w-full justify-start`}
                        >
                          {user.status === "active" ? "🚫 Block" : "✅ Unblock"}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleAction(user.email, "role", "admin")}
                          className="btn-primary btn-xs w-full justify-start"
                          disabled={user.role === "admin"}
                        >
                          👑 Make Admin
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleAction(user.email, "role", "volunteer")}
                          className="btn-secondary btn-xs w-full justify-start"
                        >
                          🤝 Make Volunteer
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleAction(user.email, "role", "donor")}
                          className="btn-accent btn-xs w-full justify-start"
                        >
                          🩸 Make Donor
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-8 bg-slate-100 rounded-3xl flex items-center justify-center">
            <span className="text-4xl text-slate-400">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-500 mb-2">No users found</h3>
          <p className="text-slate-500">{filterStatus === "all" ? "No users registered yet." : `No ${filterStatus} users.`}</p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;