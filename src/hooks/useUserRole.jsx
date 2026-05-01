import { useEffect, useState, useCallback } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState("donor");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      // ✅ WAIT for auth
      if (authLoading || !user?.email) return;

      try {
        const res = await axiosSecure.get("/users/me");

        setRole(res.data.role || "donor");
        setStatus(res.data.status || "active");
      } catch (err) {
        console.error("Role error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, authLoading, axiosSecure]);

  return { role, status, loading };
};
export default useUserRole;