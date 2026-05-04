import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  // ✅ FIXED: /api/ যোগ করুন
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (!user) {
          console.log("❌ BLOCKED REQUEST - NO USER");
          return Promise.reject("No user");
        }

        const token = await user.getIdToken();
        if (!token) {
          console.log("❌ NO TOKEN");
          return Promise.reject("No token");
        }

        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ TOKEN SENT to:", config.url); // ✅ Debug যোগ করুন

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;