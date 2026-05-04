import { useEffect, useState, useCallback } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState("donor");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);

 const fetchRole = useCallback(async () => {
  if (authLoading || !user?.email) {
    setLoading(false);
    return;
  }

  try {
    const res = await axiosSecure.get("/users/me");
    setRole(res.data.role || "donor");
    setStatus(res.data.status || "active");
  } catch (err) {
    console.error("Role fetch failed:", err.response?.status);
    // ✅ 404 হলে default donor, অন্য error হলে loading true রাখুন
    if (err.response?.status === 404) {
      setRole("donor");
      setStatus("active");
    }
  } finally {
    setLoading(false);
  }
}, [user, authLoading, axiosSecure]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  return { role, status, loading };
};
export default useUserRole;