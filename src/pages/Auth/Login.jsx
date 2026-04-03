import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <input {...register("email")} placeholder="Email" className="input" />

        <input {...register("password")} type="password" placeholder="Password" className="input" />

        <button className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;