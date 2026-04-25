// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../lib/validation";
import { useLocation } from "react-router-dom";


export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || location.state?.attempted?.pathname || "/personal-info";
  




  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    if (!name.trim()) return false;
    if (!isValidEmail(email || "")) return false;
    if (!password || password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid()) {
      setError("Please fill all fields, ensure passwords match, and use a valid email. Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      // Use the component state variables (not a non-existent `form`)
      await register(name.trim(), email.trim(), password);
      // Redirect to verify-email page and pass the email in location state
      navigate("/verify-email", { state: { email: email.trim(), from: returnTo } , replace: true });

    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("That email is already in use.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError(err?.message || "Registration failed. Please try again.");
        console.error("Register error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleRegister}>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          name="name"
        />

        <input
          type="email"
          required
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />

        <div className="relative mb-3">
          <input
            className="border p-2 w-full mb-3"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Confirm Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          required
          minLength={6}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirmPassword"
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700 transition"
          disabled={!isFormValid() || loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
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
          {loading ? "Loading..." : "Sign up with Google"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-blue-600 underline text-sm mt-3 cursor-pointer text-center"
        >
          Already have an account? Log in
        </p>
      </form>
    </div>
  );
}