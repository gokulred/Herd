import { useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  // Get the email from the state passed during navigation
  const email = location.state?.email || "your email address";

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      // We need the user's token to make this request, which is stored on login.
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication error. Please log in again.");
        setLoading(false);
        return;
      }

      // Make the API call to the verification-notification endpoint
      const response = await axios.post(
        "http://my-auth-app.test/api/email/verification-notification",
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError("Failed to resend verification email. Please try again later.");
      console.error("Resend verification error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        {message && (
          <div className="p-4 text-green-700 bg-green-100 border-l-4 border-green-500">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            {error}
          </div>
        )}
        <p className="text-gray-600">
          A verification link has been sent to{" "}
          <span className="font-medium text-gray-800">{email}</span>. Please
          check your inbox to continue.
        </p>
        <div className="pt-4">
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>
        <p className="text-sm text-center text-gray-600">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
