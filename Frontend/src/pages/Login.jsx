import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { setToken } from "../services/tokenService";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (event) => {
    setError("");
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData.email, formData.password);
      setToken(response.data.token);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.toLowerCase().includes("verify your email")) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="px-5 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-3xl font-semibold">
          Sign in to your account
        </h1>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {error && (
            <p className="rounded bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <p className="text-right text-sm">
            <Link to="/forgot-password" className="underline">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Register here
            </Link>
          </p>
          <button
            disabled={loading}
            type="submit"
            className="flex w-full justify-center rounded bg-black px-3 py-2 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
export default Login;
