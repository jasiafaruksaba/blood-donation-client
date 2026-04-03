import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { registerUser } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(
        data.email,
        data.password,
        data.name,
        data.avatar
      );
      alert("Registered Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <input {...register("name")} placeholder="Name" className="input" />

        <input {...register("email")} placeholder="Email" className="input" />

        <input {...register("avatar")} placeholder="Image URL" className="input" />

        <input {...register("password")} type="password" placeholder="Password" className="input" />

        <button className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;