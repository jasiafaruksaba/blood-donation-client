import { useForm } from "react-hook-form";
import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router"; 
import useAuth from "../../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { user, loginUser, googleSignIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loginUser(data.email, data.password);
      // useEffect automatically handle redirect
    } catch (err) {
      console.error("Login Error:", err);
      
      // Better error message
      let errorMessage = "Invalid email or password.";
      
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email and password.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
    } catch (err) {
      console.error("Google Error:", err);
      alert(err.message || "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
          <p className="mt-4 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100">

          {/* Logo */}
          <Link to="/" className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-2xl">
                <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-4xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                LifeDrop
              </span>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-center text-slate-500 mb-8">Sign in to continue saving lives</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100/50 transition-all shadow-sm"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: { value: 6, message: "Minimum 6 characters" } 
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100/50 pr-12 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:bg-slate-400 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || authLoading}
            className="w-full mt-6 flex items-center justify-center gap-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-4 px-6 rounded-2xl font-semibold text-slate-700 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            Continue with Google
          </button>

          <p className="text-center mt-8 text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-red-600 hover:text-red-700">
              Register as Donor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;