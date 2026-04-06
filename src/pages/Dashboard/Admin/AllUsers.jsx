import { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosSecure.get("/users").then((res) => setUsers(res.data));
  }, []);

  const handleAction = async (email, action, value) => {
    await axiosSecure.patch(`/users/${email}`, { [action]: value });

    setUsers(
      users.map((u) =>
        u.email === email ? { ...u, [action]: value } : u
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">All Users</h2>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>

              <td className="space-x-2">

                {/* Block / Unblock */}
                {u.status === "active" ? (
                  <button
                    onClick={() =>
                      handleAction(u.email, "status", "blocked")
                    }
                    className="btn btn-error btn-xs"
                  >
                    Block
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleAction(u.email, "status", "active")
                    }
                    className="btn btn-success btn-xs"
                  >
                    Unblock
                  </button>
                )}

                {/* Role Change */}
                <button
                  onClick={() =>
                    handleAction(u.email, "role", "volunteer")
                  }
                  className="btn btn-xs"
                >
                  Make Volunteer
                </button>

                <button
                  onClick={() =>
                    handleAction(u.email, "role", "admin")
                  }
                  className="btn btn-xs"
                >
                  Make Admin
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;