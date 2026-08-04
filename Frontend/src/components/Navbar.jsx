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
  if (loading)
    return (
      <div className="h-16">
        <span className="loader" />
      </div>
    );
  return (
    <nav className="border-b border-gray-200 bg-white px-5 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="text-xl font-bold">
          BlogSpace
        </NavLink>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <NavLink to="/">Home</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              {["author", "admin"].includes(user.role) && (
                <NavLink to="/my-blogs">My blogs</NavLink>
              )}
              {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
            </>
          )}
          {user ? (
            <button onClick={signOut} className="rounded border px-3 py-1">
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink
                to="/register"
                className="rounded bg-black px-3 py-1 text-white"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
