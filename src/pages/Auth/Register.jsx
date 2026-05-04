import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { bdDistricts, bdUpazilas } from "../../data/bdLocations";

const Register = () => {
  const { user, registerUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password strength states
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirm_password");

  useEffect(() => {
    if (user?.uid) navigate("/dashboard");
  }, [user, navigate]);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setHasUppercase(false);
      setHasLowercase(false);
      setHasNumber(false);
      setHasMinLength(false);
      return;
    }

    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasMinLength(password.length >= 8);
  }, [password]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setValue("photo", file);
  };

  // ImgBB Upload
  const uploadToImgBB = async (file, name) => {
    if (!file) return "";

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData
      );
      return res.data.data.url;
    } catch {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    // Check if all required fields are filled
    if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim() ||
      !data.confirm_password?.trim() || !data.bloodGroup || !data.district ||
      !data.upazila) {
      alert("Please fill all required fields!");
      return;
    }

    if (data.password !== data.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasMinLength) {
      alert("Password must contain uppercase, lowercase, number and minimum 8 characters!");
      return;
    }

    setLoading(true);

    try {
      // Backend আগে save করুন (MongoDB)
      const photoURL = data.photo
        ? await uploadToImgBB(data.photo, data.name)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`;

      const userData = {
        name: data.name.trim(),
        email: data.email.trim(),
        avatar: photoURL,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila
      };

      // 1. Backend (MongoDB) - PUBLIC ROUTE
      const backendRes = await axios.post("http://localhost:3000/api/users/register", userData);
      console.log("✅ MongoDB Saved:", backendRes.data);

      // 2. Firebase Auth
      await registerUser(data.email, data.password, {
        name: data.name.trim(),
        avatar: photoURL
      });
      console.log("✅ Firebase Auth Done");

      alert("✅ Registration successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("❌ Full Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="animate-pulse">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">

        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8">
          <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg">
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">❤️ LifeDrop</h1>
          </div>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm">Join us to save lives! 🩸</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Info Section */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
            <h3 className="font-semibold text-red-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Personal Information
            </h3>

            {/* Name */}
            <div className="relative">
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                placeholder="Full Name"
                className={`input input-bordered w-full pr-10 transition-all duration-300 ${errors.name ? 'input-error border-red-400' : 'input-success border-green-400 focus:border-green-500'
                  }`}
              />
              {errors.name && (
                <FaTimesCircle className="absolute right-3 top-3 text-red-500 text-lg" />
              )}
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

            {/* Email */}
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="Email Address"
              className={`input input-bordered w-full mt-4 transition-all duration-300 ${errors.email ? 'input-error border-red-400' : 'input-success border-green-400 focus:border-green-500'
                }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Section */}
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-2xl border border-pink-100">
            <h3 className="font-semibold text-pink-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
              Secure Password
            </h3>

            {/* Password */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters required" }
                })}
                placeholder="Create Password"
                className="input input-bordered w-full pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2 mb-4 p-3 bg-white/50 rounded-xl border border-gray-200">
              <div className={`flex items-center text-sm ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                <FaCheckCircle className={`mr-2 ${hasMinLength ? 'text-green-500' : ''}`} />
                At least 8 characters
              </div>
              <div className={`flex items-center text-sm ${hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                <FaCheckCircle className={`mr-2 ${hasUppercase ? 'text-green-500' : ''}`} />
                One uppercase letter
              </div>
              <div className={`flex items-center text-sm ${hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                <FaCheckCircle className={`mr-2 ${hasLowercase ? 'text-green-500' : ''}`} />
                One lowercase letter
              </div>
              <div className={`flex items-center text-sm ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                <FaCheckCircle className={`mr-2 ${hasNumber ? 'text-green-500' : ''}`} />
                One number
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirm_password", {
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                placeholder="Confirm Password"
                className={`input input-bordered w-full pr-10 transition-all duration-300 ${errors.confirm_password ? 'input-error border-red-400' : 'input-success border-green-400 focus:border-green-500'
                  }`}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          {/* Location & Blood Group Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Location & Blood Group
            </h3>

            {/* Blood Group */}
            <select
              {...register("bloodGroup", { required: "Blood group is required" })}
              className="select select-bordered w-full mb-4 transition-all duration-300 focus:border-orange-500"
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            {/* District */}
            <select
              {...register("district", { required: "District is required" })}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setValue("upazila", "");
                clearErrors("upazila");
              }}
              className="select select-bordered w-full mb-4 transition-all duration-300 focus:border-orange-500"
            >
              <option value="">Select District</option>
              {bdDistricts.map(d => <option key={d}>{d}</option>)}
            </select>

            {/* Upazila */}
            <select
              {...register("upazila", { required: "Upazila is required" })}
              disabled={!selectedDistrict}
              className="select select-bordered w-full transition-all duration-300 focus:border-orange-500"
            >
              <option value="">Select Upazila</option>
              {selectedDistrict &&
                bdUpazilas[selectedDistrict]?.map(u => (
                  <option key={u}>{u}</option>
                ))}
            </select>
          </div>

          {/* Avatar Upload */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Profile Picture
            </h3>
            <div className="border-2 border-dashed border-blue-300 p-6 rounded-2xl text-center cursor-pointer hover:border-blue-400 transition-all duration-300 hover:bg-blue-50">
              <input
                type="file"
                accept="image/*"
                {...register("photo")}
                onChange={handleImageChange}
                className="hidden"
                id="upload"
              />
              <label htmlFor="upload" className="cursor-pointer">
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} alt="Preview" className="w-24 h-24 mx-auto rounded-2xl shadow-md ring-2 ring-blue-200" />
                    <p className="text-sm text-blue-600 font-medium">✅ Photo Selected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">Upload Profile Photo</p>
                    <p className="text-sm text-gray-500">(Optional - Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading || !hasUppercase || !hasLowercase || !hasNumber || !hasMinLength}
            className="btn w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading || uploading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner"></span>
                Creating Account...
              </span>
            ) : (
              "🚀 Join LifeDrop Now"
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 font-bold hover:text-red-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;