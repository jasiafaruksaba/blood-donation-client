import { Navigate } from "react-router";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { role, loading } = useUserRole();

  if (loading) return <p>Loading...</p>;

  if (role === "admin") return children;

  return <Navigate to="/" />;
};

export default AdminRoute;