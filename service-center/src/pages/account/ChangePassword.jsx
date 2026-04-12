
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
export default function ChangePassword() {
  const { auth } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const handleReset = async () => {
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    setEmailSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>

      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
        {emailSent ? (
          <p>Password reset email sent.</p>
        ) : (
          <button
            onClick={handleReset}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Send Password Reset Email
          </button>
        )}
      </div>
    </div>
  );
}