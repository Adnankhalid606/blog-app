import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
