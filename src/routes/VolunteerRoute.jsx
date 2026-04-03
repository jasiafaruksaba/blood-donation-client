import { Navigate } from "react-router";
import useUserRole from "../hooks/useUserRole";

const VolunteerRoute = ({ children }) => {
  const { role, loading } = useUserRole();

  if (loading) return <p>Loading...</p>;

  if (role === "volunteer") return children;

  return <Navigate to="/" />;
};

export default VolunteerRoute;