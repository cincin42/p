import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  // Not logged in → send to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but email not verified → send to verify page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // ⭐ FINALLY return the protected content
  return children;
}