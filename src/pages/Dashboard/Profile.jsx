import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setProfile(res.data);
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axiosSecure.patch(`/users/${user.email}`, profile);

    setEdit(false);
    alert("Profile Updated");
  };

  return (
    <div className="max-w-lg bg-white p-5 shadow">
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Profile</h2>
        <button onClick={() => setEdit(!edit)} className="btn">
          {edit ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-3">

        <input
          value={profile.name || ""}
          disabled={!edit}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
          className="input w-full"
        />

        <input
          value={profile.email || ""}
          disabled
          className="input w-full"
        />

        <input
          value={profile.avatar || ""}
          disabled={!edit}
          onChange={(e) =>
            setProfile({ ...profile, avatar: e.target.value })
          }
          className="input w-full"
        />

        <input
          value={profile.bloodGroup || ""}
          disabled={!edit}
          onChange={(e) =>
            setProfile({ ...profile, bloodGroup: e.target.value })
          }
          className="input w-full"
        />

        {edit && (
          <button className="btn btn-primary w-full">
            Save
          </button>
        )}

      </form>
    </div>
  );
};

export default Profile;