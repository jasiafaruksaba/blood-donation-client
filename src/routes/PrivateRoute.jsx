
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const PrivateRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;