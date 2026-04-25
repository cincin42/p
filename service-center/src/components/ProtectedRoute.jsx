import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireVerified = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-6">Loading...</div>;

 
  // Not authenticated → send to login and preserve where they were going
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || "/", attempted: location }}
      />
    );
  }

  // Logged in but email not verified → send to verify page and preserve destination
  if (requireVerified && !user.emailVerified) {
    return (
      <Navigate
        to="/verify-email"
        replace
        state={{ from: location.pathname || "/", attempted: location }}
      />
    );
  }

  // Authenticated (and verified if required) → render protected content
  return children;
}
