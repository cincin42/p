// src/pages/VerifyEmail.jsx
import React, { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const { sendVerification, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || user?.email || "";
  const returnTo = location.state?.from || location.state?.attempted?.pathname || "/personal-info";



  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setStatus("");
    setSending(true);
    try {
      const res = await sendVerification();
      if (res?.success) setStatus("Verification email sent. Check your inbox.");
      else setStatus(res?.message || "Could not send verification email.");
    } catch (err) {
      setStatus("Failed to send verification email. Try again later.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleContinue = async () => {
    setStatus("");
    try { 
      // Ensure firebase has the latest user state
      if (user && user.reload) await user.reload();
      if (user?.emailVerified) {
        //Navigate back to original destination
        navigate(returnTo, {replace: true});
      }
      else {
        setStatus("Your email is still not verified. Please check your inbox and click the verification link.");
      }
    } catch (err) {
      setStatus("Failed to check verification status. Try again later.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verify your email</h1>

      <p className="mb-4">
        We sent a verification link to <strong>{email}</strong>. Click the link in that email to verify your account.
      </p>

      {status && <div className="mb-4 text-sm text-yellow-300">{status}</div>}

      <div className="flex gap-2">
        <button
          onClick={handleResend}
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {sending ? "Sending..." : "Resend verification email"}
        </button>

        <button
          onClick={handleContinue}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          I verified, continue
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Didn’t receive the email? Check your spam folder or try resending.
      </p>
    </div>
  );
}