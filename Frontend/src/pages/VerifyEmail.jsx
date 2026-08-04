import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../services/authService";
import { setToken } from "../services/tokenService";
import { useAuth } from "../hooks/useAuth";
function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(params.get("email") || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const verify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await verifyEmail(email.trim(), otp.trim());
      setToken(response.data.token);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const resend = async () => {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await resendVerificationEmail(email.trim());
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="px-5 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-gray-500">Email verification</p>
        <h1 className="mt-1 text-3xl font-bold">Verify your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the OTP sent to your email. If you did not receive one, request
          a new code.
        </p>
        <form onSubmit={verify} className="mt-7 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">OTP code</label>
            <input
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="6"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-center text-lg tracking-[0.3em]"
            />
          </div>
          {message && (
            <p className="rounded bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Verify email"}
          </button>
        </form>
        <button
          disabled={loading}
          onClick={resend}
          className="mt-4 w-full rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          Send a new code
        </button>
        <p className="mt-5 text-center text-sm text-gray-600">
          Already verified?{" "}
          <Link to="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
export default VerifyEmail;
