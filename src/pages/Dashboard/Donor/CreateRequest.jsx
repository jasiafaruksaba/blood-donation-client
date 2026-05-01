import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";
import { bdDistricts, bdUpazilas } from "../../../data/bdLocations";

const CreateRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { status } = useUserRole();

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (status === "blocked") {
      alert("❌ You are blocked by admin. Cannot create request.");
      return;
    }

    const requestData = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      recipientName: data.recipientName,
      recipientDistrict: data.recipientDistrict,
      recipientUpazila: data.recipientUpazila,
      hospital: data.hospital,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      message: data.message,
      status: "pending",
    };

    try {
      await axiosSecure.post("/donation-requests", requestData);
      alert("✅ Donation Request Created Successfully!");
      reset();
      setSelectedDistrict("");
    } catch (err) {
      alert("❌ Failed to create request!");
    }
  };

  const upazilas = selectedDistrict ? bdUpazilas[selectedDistrict] || [] : [];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-black mb-8">Create New Blood Donation Request</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Requester Name</label>
            <input value={user?.displayName} disabled className="w-full px-5 py-3 border rounded-2xl bg-slate-100" />
          </div>
          <div>
            <label className="block font-medium mb-1">Requester Email</label>
            <input value={user?.email} disabled className="w-full px-5 py-3 border rounded-2xl bg-slate-100" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Recipient Name</label>
          <input {...register("recipientName", { required: true })} className="w-full px-5 py-3 border rounded-2xl" placeholder="Patient's full name" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Recipient District</label>
            <select
              {...register("recipientDistrict", { required: true })}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-5 py-3 border rounded-2xl"
            >
              <option value="">Select District</option>
              {bdDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Recipient Upazila</label>
            <select
              {...register("recipientUpazila", { required: true })}
              disabled={!selectedDistrict}
              className="w-full px-5 py-3 border rounded-2xl disabled:bg-slate-100"
            >
              <option value="">Select Upazila</option>
              {upazilas.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Hospital Name</label>
          <input {...register("hospital", { required: true })} className="w-full px-5 py-3 border rounded-2xl" placeholder="Dhaka Medical College Hospital" />
        </div>

        <div>
          <label className="block font-medium mb-1">Full Address</label>
          <textarea {...register("fullAddress", { required: true })} className="w-full px-5 py-3 border rounded-2xl h-24" placeholder="House no, Road, Area..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Blood Group Needed</label>
            <select {...register("bloodGroup", { required: true })} className="w-full px-5 py-3 border rounded-2xl">
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Donation Date</label>
            <input type="date" {...register("donationDate", { required: true })} className="w-full px-5 py-3 border rounded-2xl" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Donation Time</label>
          <input type="time" {...register("donationTime", { required: true })} className="w-full px-5 py-3 border rounded-2xl" />
        </div>

        <div>
          <label className="block font-medium mb-1">Request Message</label>
          <textarea {...register("message")} className="w-full px-5 py-3 border rounded-2xl h-32" placeholder="Why is blood needed? Patient condition..." />
        </div>

        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl text-lg">
          Submit Donation Request
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;