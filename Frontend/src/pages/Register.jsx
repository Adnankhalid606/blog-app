import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, verifyEmail } from "../services/authService";
import { setToken } from "../services/tokenService";
import { useAuth } from "../hooks/useAuth";
import { capitalizeWords } from "../utils/capitalizeWords";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState("register");
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (event) => {
    setError("");
    const value = event.target.name === "username" ? capitalizeWords(event.target.value) : event.target.value;
    setForm((current) => ({ ...current, [event.target.name]: value }));
  };

  const register = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const response = await registerUser({ username: form.username.trim(), email: form.email.trim(), password: form.password });
      setMessage(response.data.message || "We sent a verification code to your email.");
      setStep("verify");
    } catch (err) { setError(err.response?.data?.message || err.message); } finally { setLoading(false); }
  };

  const verify = async (event) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const response = await verifyEmail(form.email.trim(), otp.trim());
      setToken(response.data.token);
      login(response.data.user);
      navigate("/");
    } catch (err) { setError(err.response?.data?.message || err.message); } finally { setLoading(false); }
  };

  return <main className="px-5 py-10"><div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">{step === "register" ? <><p className="text-sm font-medium text-gray-500">Create account</p><h1 className="mt-1 text-3xl font-bold text-gray-900">Join BlogSpace</h1><p className="mt-2 text-sm text-gray-600">Create your account, then verify your email with a one-time code.</p><form onSubmit={register} className="mt-7 space-y-4"><div><label className="mb-1 block text-sm font-medium text-gray-700">Name</label><input required name="username" value={form.username} onChange={change} autoComplete="name" className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900" /></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Email</label><input required type="email" name="email" value={form.email} onChange={change} autoComplete="email" className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900" /></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Password</label><input required minLength="6" type="password" name="password" value={form.password} onChange={change} autoComplete="new-password" className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900" /></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Confirm password</label><input required type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} autoComplete="new-password" className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900" /></div>{error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full cursor-pointer rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button></form><p className="mt-5 text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium underline hover:text-gray-900">Sign in</Link></p></> : <><button onClick={() => setStep("register")} className="cursor-pointer text-sm font-semibold text-gray-600 underline hover:text-gray-900 transition-colors">&larr; Back</button><p className="mt-5 text-sm font-medium text-gray-500">Email verification</p><h1 className="mt-1 text-3xl font-bold text-gray-900">Enter your code</h1><p className="mt-2 text-sm text-gray-600">{message} Check <b>{form.email}</b>.</p><form onSubmit={verify} className="mt-7 space-y-4"><div><label className="mb-1 block text-sm font-medium text-gray-700">OTP code</label><input required inputMode="numeric" pattern="[0-9]*" maxLength="6" value={otp} onChange={(event) => { setOtp(event.target.value); setError(""); }} placeholder="Enter OTP" className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-center text-lg tracking-[0.3em] shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900" /></div>{error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="w-full cursor-pointer rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Verifying..." : "Verify email"}</button></form></>}</div></main>;
}
export default Register;