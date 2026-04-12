import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ServiceCard({ title, description, price }) {
  const { user, loading } = useAuth();

  // ✅ Wait for Firebase auth to initialize
  if (loading) {
    return (
      <div className="rounded-2xl border p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-4 w-60 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div
      className="
        bg-white rounded-xl shadow-md p-6 cursor-pointer
        transform transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl hover:scale-[1.03]
        hover:shadow-red-300/40
      "
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <p className="text-red-600 font-semibold text-lg">${price}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {/* ❌ Not logged in */}
        {!user ? (
          <>
            <Link
              to="/login"
              state={{ from: "/.appointment"}}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Sign up
            </Link>
          </>
        ) : !user.emailVerified ? (
          /* ❌ Logged in but NOT verified */
          <>
            <button
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              title="Verify your email to schedule"
            >
              Schedule appointment
            </button>
            <Link
              to="/verify-email"
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Verify email
            </Link>
          </>
        ) : (
          /* ✅ Logged in + verified */
          <Link
            to="/appointment"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Schedule appointment
          </Link>
        )}
      </div>
    </div>
  );
}
