import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";

const CreateRequest = () => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const requestData = {
      ...data,
      requesterName: user.displayName,
      requesterEmail: user.email,
      createdAt: new Date(),
    };

    await axiosSecure.post("/donation-requests", requestData);
    alert("Request Created");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <input value={user?.displayName} readOnly className="input w-full" />
        <input value={user?.email} readOnly className="input w-full" />

        <input {...register("recipientName")} placeholder="Recipient Name" className="input w-full" />

        <input {...register("district")} placeholder="District" className="input w-full" />

        <input {...register("upazila")} placeholder="Upazila" className="input w-full" />

        <input {...register("hospital")} placeholder="Hospital Name" className="input w-full" />

        <input {...register("address")} placeholder="Full Address" className="input w-full" />

        <input {...register("bloodGroup")} placeholder="Blood Group" className="input w-full" />

        <input type="date" {...register("date")} className="input w-full" />

        <input type="time" {...register("time")} className="input w-full" />

        <textarea {...register("message")} placeholder="Why need blood?" className="input w-full"></textarea>

        <button className="btn btn-primary w-full">Request</button>
      </form>
    </div>
  );
};

export default CreateRequest;