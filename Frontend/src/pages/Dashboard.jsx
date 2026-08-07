import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function Dashboard() {
  const { user } = useAuth();
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back, {user?.username}.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/my-blogs"
          className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
        >
          <h2 className="text-lg font-semibold text-gray-900">My Blogs</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit, submit, view, and delete your blogs.
          </p>
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900">Admin Review Panel</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review pending blog submissions and author applications.
            </p>
          </Link>
        )}
      </div>
    </main>
  );
}
export default Dashboard;
