import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { bdDistricts, bdUpazilas } from "../../data/bdLocations";

const Register = () => {
  const { user, registerUser, googleSignIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const watchDistrict = watch("district");

  // ✅ Auto redirect after registration
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ File size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setValue("photo", file);
    }
  };

  const uploadToImgBB = async (imageFile) => {
    if (!imageFile) return "";

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    // ✅ Your ImgBB API Key এখানে দিন
    const API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "your-api-key-here";

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}&expiration=2592000`, // 30 days
        formData,
        { timeout: 30000 } // 30 sec timeout
      );
      console.log("✅ Image uploaded:", res.data.data.url);
      return res.data.data.url;
    } catch (error) {
      console.error("❌ ImgBB Error:", error.response?.data || error.message);
      // ✅ Fallback: default avatar
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(watch("name") || "User")}&background=ef4444&color=fff&size=128`;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let photoURL = "";

      // ✅ Upload Image to ImgBB
      if (data.photo && data.photo[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${API_KEY}`,
          formData
        );

        photoURL = res.data.data.url;
      }

      // ✅ Correct userData
      const userData = {
        name: data.name,
        email: data.email,
        photoURL,
        district: data.district,
        upazila: data.upazila,
      };

      // ✅ Call register
      await registerUser(data.email, data.password, userData);

      alert("Registration successful");
    } catch (err) {
      console.error(err);
      alert(err.message);
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
      alert(err.message || "Google sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 py-12 px-4">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-slate-100/50">

        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 block">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-2xl shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              LifeDrop
            </span>
          </Link>

          <h2 className="text-4xl font-black text-slate-800 mb-3">Join LifeDrop</h2>
          <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
            Register as a blood donor and save lives in your community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
              <input
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100/50 transition-all shadow-sm h-14"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email"
                  }
                })}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100/50 transition-all shadow-sm h-14"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100/50 pr-14 transition-all shadow-sm h-14"
                  placeholder="Create strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500 p-1 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  onChange={handleImageChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="mb-4">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-32 h-32 mx-auto rounded-2xl object-cover shadow-lg ring-2 ring-red-200" />
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-4xl text-slate-400 group-hover:text-red-400 transition-colors">
                        📸
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-slate-700 group-hover:text-red-600 transition-colors">
                    {previewUrl ? "Change Photo" : "Upload Photo"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG (Max 5MB)</p>
                </label>
              </div>
              {uploading && <p className="text-sm text-emerald-600 mt-2 flex items-center gap-2"><span className="loading loading-spinner loading-xs"></span>Uploading...</p>}
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">District *</label>
                <select
                  {...register("district", { required: "District is required" })}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setValue("upazila", "");
                  }}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100/50 transition-all shadow-sm h-14"
                >
                  <option value="">Select District ({bdDistricts.length} total)</option>
                  {bdDistricts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-sm mt-2">{errors.district.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Upazila *</label>
                <select
                  {...register("upazila", { required: "Upazila is required" })}
                  disabled={!selectedDistrict}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100/50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all shadow-sm h-14"
                >
                  <option value="">
                    {selectedDistrict ? `Select Upazila (${bdUpazilas[selectedDistrict]?.length || 0})` : "Select District First"}
                  </option>
                  {selectedDistrict && bdUpazilas[selectedDistrict]?.map((up) => (
                    <option key={up} value={up}>{up}</option>
                  ))}
                </select>
                {errors.upazila && <p className="text-red-500 text-sm mt-2">{errors.upazila.message}</p>}
              </div>
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading || authLoading || uploading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-5 px-8 rounded-3xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 h-16"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-lg"></span>
                Creating Account...
              </>
            ) : (
              <>
                ✅ <span>Join as Donor</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-6 bg-white text-slate-500 font-medium">Or</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading || authLoading}
          className="w-full flex items-center justify-center gap-4 border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 py-5 px-8 rounded-3xl font-semibold text-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] h-16"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-7 h-7" />
          <span>Continue with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center mt-10 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-red-600 hover:text-red-700 transition-colors font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;