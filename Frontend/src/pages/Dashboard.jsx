import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function Dashboard() {
  const { user } = useAuth();
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back, {user?.username}.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link to="/my-blogs" className="rounded border p-6 hover:bg-gray-50">
          <h2 className="font-semibold">My blogs</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create, edit, submit, and delete your blogs.
          </p>
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="rounded border p-6 hover:bg-gray-50">
            <h2 className="font-semibold">Admin review</h2>
            <p className="mt-1 text-sm text-gray-600">
              Review pending blogs and author requests.
            </p>
          </Link>
        )}
      </div>
    </main>
  );
}
export default Dashboard;
