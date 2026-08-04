import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
