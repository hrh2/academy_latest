// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { userData,loading } = useAuth();

  if (loading) return null; // or a loading spinner

  if (!userData) {
    return <Navigate to="/auth/sign-in" />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />; // Or your custom 403 page
  }

  return children;
};

export default PrivateRoute;
