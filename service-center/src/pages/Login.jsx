import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";




export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin, loading, user } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  
  const location = useLocation();


    // default fallback if user just visits /login directly
  const from = location.state?.from || "/account";

  
  const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors

  const result = await login(email, password, rememberMe);

  if (!result.success) {
    setError(result.message); // or set an error state
    return;
  }

};

useEffect(() => {
  if (!user) return;

  if (user.emailVerified) {
    navigate("/");
  } else {
    navigate("/verify-email", {
      state: { from },
      replace: true
    });
    
  }
}, [user, navigate, from]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {
        error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </p>
        )
      }

      <form onSubmit={handleLogin}>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Remember Me
        </label>

        <button
          className="bg-blue-600 text-white p-2 w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
        type="button"
        onClick={googleLogin}
        className="flex items-center justify-center gap-3 bg-white text-gray-800 border p-2 w-full mt-3 rounded shadow hover:bg-gray-100 transition"
        disabled={loading}
>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? "Loading..." : "Continue with Google"}
        </button>
        <p
          onClick={() => navigate("/reset-password")}
          className="text-blue-600 underline text-sm mt-2 cursor-pointer"
      >
        Forgot Password?
      </p>

      </form>
    </div>
  );
}