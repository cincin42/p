import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    setMessage("Password reset email sent! Check your inbox.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Reset Password</h2>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full mb-4 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition"
          >
            Send Reset Email
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}