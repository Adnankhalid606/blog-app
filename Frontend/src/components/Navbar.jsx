import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `cursor-pointer text-sm font-medium transition-colors ${
      isActive
        ? "text-gray-900 font-semibold"
        : "text-gray-600 hover:text-gray-900"
    }`;

  if (loading)
    return (
      <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-white">
        <span className="loader" />
      </div>
    );

  return (
    <nav className="border-b border-gray-200 bg-white px-5 py-3.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="text-xl font-extrabold tracking-tight text-gray-900">
          BlogSpace
        </NavLink>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              {["author", "admin"].includes(user.role) && (
                <NavLink to="/my-blogs" className={navLinkClass}>
                  My Blogs
                </NavLink>
              )}
              {user.role === "admin" && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin Panel
                </NavLink>
              )}
            </>
          )}
          {user ? (
            <button
              onClick={signOut}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="cursor-pointer rounded-md bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-gray-800 transition-colors"
              >
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
