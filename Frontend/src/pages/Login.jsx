import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { setToken } from "../services/tokenService";


export default function Login() {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError(null);
    setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
}));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await loginUser(email, password);
      setToken(res.data.token);
      login(res.data.user);
      navigate("/");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <div className="w-full lg:w-1/3 mx-auto mt-30 border border-gray-200 shadow rounded-2xl">
        <h1 className="text-center text-3xl font-semibold mt-7">
          Sign in to your account
        </h1>

        <div className="w-full h-full p-12  ">
          <form
            action=""
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-700"
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
              className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-base font-normal hover:shadow-md focus:shadow-md focus:border-gray-800 "
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-base font-normal hover:shadow-md focus:shadow-md focus:border-gray-800 "
              onChange={handleChange}
            />
            <div className="text-red-800 ">{
              error && <p>{error}</p>
              }</div>
            <div className="flex items-center justify-center">
              <p>
                Don't have an Account?
                <Link
                  to="/register"
                  className="cursor-pointer underline hover:font-bold"
                >
                  Register here
                </Link>
              </p>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border px-3 py-2 font-semibold text-white bg-black hover:bg-gray-800 cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
