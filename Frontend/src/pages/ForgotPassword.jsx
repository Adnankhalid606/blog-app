import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset, resetPassword } from "../services/authService";
function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const sendCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response.data.message);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const savePassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email.trim(), otp.trim(), password);
      setMessage("Password reset successfully");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="px-5 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {step === "email" ? (
          <>
            <p className="text-sm font-medium text-gray-500">
              Password recovery
            </p>
            <h1 className="mt-1 text-3xl font-bold">Forgot password?</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and we will send a reset code.
            </p>
            <form onSubmit={sendCode} className="mt-7 space-y-4">
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
              {error && (
                <p className="rounded bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                disabled={loading}
                className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep("email")}
              className="text-sm underline"
            >
              ? Change email
            </button>
            <p className="mt-5 text-sm font-medium text-gray-500">
              Reset password
            </p>
            <h1 className="mt-1 text-3xl font-bold">Set a new password</h1>
            <p className="mt-2 text-sm text-gray-600">
              {message} Check <b>{email}</b> for the OTP.
            </p>
            <form onSubmit={savePassword} className="mt-7 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  OTP code
                </label>
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
              <div>
                <label className="mb-1 block text-sm font-medium">
                  New password
                </label>
                <input
                  required
                  minLength="6"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Confirm new password
                </label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              {error && (
                <p className="rounded bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              {message === "Password reset successfully" && (
                <p className="rounded bg-green-50 p-3 text-sm text-green-700">
                  Password reset successfully. Redirecting to sign in...
                </p>
              )}
              <button
                disabled={loading || message === "Password reset successfully"}
                className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset password"}
              </button>
            </form>
          </>
        )}
        <p className="mt-5 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
export default ForgotPassword;
