import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, googleLogin, loading } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(email, password);   // ⭐ Use your AuthContext
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleRegister}>
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

        <button className="bg-green-600 text-white p-2 w-full">
          Create Account
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
      </form>
    </div>
  );
}