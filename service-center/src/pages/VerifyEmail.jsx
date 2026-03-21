import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const { user, sendVerification } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>

        <p className="text-gray-700 mb-2">
          Hi <span className="font-semibold">{user?.name}</span>,
        </p>

        <p className="text-gray-700 mb-6">
          We sent a verification link to:
        </p>

        <p className="font-semibold text-blue-600 mb-6">{user?.email}</p>

        <p className="text-gray-600 mb-6">
          Please check your inbox and click the verification link to activate your account.
        </p>

        <button
          onClick={sendVerification}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}