import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, googleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if ( password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const result = await register(name, email, password);

    if (result?.success === false) {
      setError(result.message);
      return;
    }
    navigate("/verify-email");
  }
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleRegister}>

        {/*Name */}
        <input
          className="border p-2 w-full mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

          {/*Email */}
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          
        />

        {/*Password */}
        
        <div className="relative mb-3">
          <input
          className="border p-2 w-full mb-3"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />

          <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

         {/* Confirm Password */}
        <input
          className="border p-2 w-full mb-3"
          placeholder="Confirm Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />


        {/*Create Account Button */}
        <button 
          className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700 transition"
          disabled={loading} 
          >
          {loading ? "Creating Account..." : "Create Account"}
          </button>
       
       {/* Google Signup */}
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

        {/* Already have an account */}
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
