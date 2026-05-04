
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { bdDistricts, bdUpazilas } from "../../data/bdLocations";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch profile
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`)
        .then(res => {
          const data = res.data;
          setProfile(data);
          setSelectedDistrict(data.district || "");
        })
        .catch(err => console.error("Failed to load profile:", err));
    }
  }, [user, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: profile.name || profile.fullName,
        avatar: profile.avatar,
        bloodGroup: profile.bloodGroup,
        district: profile.district,
        upazila: profile.upazila
      };

      // Remove empty fields
      Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
      );

      await axiosSecure.patch("/users/me", updateData);
      alert("✅ Profile updated!");
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const upazilas = selectedDistrict ? bdUpazilas[selectedDistrict] || [] : [];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-900">My Profile</h2>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all ${isEditing
            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
            : "bg-red-600 hover:bg-red-700 text-white"
            }`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <img
            src={profile.avatar || user?.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || "User")}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-red-100 object-cover shadow-md"
          />

        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
          <input
            value={profile.name || profile.fullName || ""}   // Support both
            onChange={(e) => setProfile({ ...profile, name: e.target.value, fullName: e.target.value })}
            disabled={!isEditing}
            className="w-full px-5 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:border-red-500 disabled:bg-slate-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
          <input
            value={profile.email || user?.email || ""}
            disabled
            className="w-full px-5 py-3 border border-slate-300 rounded-2xl bg-slate-100 cursor-not-allowed"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Blood Group</label>
          <select
            value={profile.bloodGroup || ""}
            onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
            disabled={!isEditing}
            className="w-full px-5 py-3 border border-slate-300 rounded-2xl focus:outline-none disabled:bg-slate-100"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        {/* District & Upazila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">District</label>
            <select
              value={profile.district || ""}
              onChange={(e) => {
                const newDistrict = e.target.value;
                setProfile({ ...profile, district: newDistrict });
                setSelectedDistrict(newDistrict);
                // Reset upazila when district changes
                setProfile(prev => ({ ...prev, upazila: "" }));
              }}
              disabled={!isEditing}
              className="w-full px-5 py-3 border border-slate-300 rounded-2xl focus:outline-none disabled:bg-slate-100"
            >
              <option value="">Select District</option>
              {bdDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Upazila</label>
            <select
              value={profile.upazila || ""}
              onChange={(e) => setProfile({ ...profile, upazila: e.target.value })}
              disabled={!isEditing || !selectedDistrict}
              className="w-full px-5 py-3 border border-slate-300 rounded-2xl focus:outline-none disabled:bg-slate-100"
            >
              <option value="">Select Upazila</option>
              {upazilas.map(up => (
                <option key={up} value={up}>{up}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 rounded-2xl text-lg transition-all mt-4"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;