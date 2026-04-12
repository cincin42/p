import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireVerified = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-6">Loading...</div>;

  // Not logged in → send to login
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} />;

  // Logged in but email not verified → send to verify page
  if ( requireVerified && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} />;
  }

  // ⭐ FINALLY return the protected content
  return children;
}