import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  acceptApplication,
  approveBlog,
  getPendingApplications,
  getPendingBlogs,
  rejectApplication,
  rejectBlog,
} from "../services/adminService";

function Admin() {
  const [blogs, setBlogs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    const [blogResult, applicationResult] = await Promise.allSettled([
      getPendingBlogs(),
      getPendingApplications(),
    ]);
    if (blogResult.status === "fulfilled")
      setBlogs(blogResult.value.data.blogs || []);
    else
      setError(
        blogResult.reason.response?.data?.message || blogResult.reason.message,
      );
    if (applicationResult.status === "fulfilled")
      setApplications(applicationResult.value.data.pendingApplications || []);
    else
      setError(
        (current) =>
          current ||
          applicationResult.reason.response?.data?.message ||
          applicationResult.reason.message,
      );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (fn, id) => {
    setActionId(id);
    try {
      await fn(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionId(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loader" />
      </div>
    );

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Admin Review Panel</h1>
      <p className="mt-1 text-sm text-gray-500">
        Review pending blog posts and author applications
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Pending Blogs</h2>
        <div className="mt-3 space-y-3">
          {blogs.map((blog) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              key={blog.id}
            >
              <div>
                <p className="font-medium text-gray-900">{blog.title}</p>
                <p className="text-sm text-gray-500">
                  By {blog.author_name || `Author #${blog.author_id}`}
                </p>
              </div>
              <span className="flex items-center gap-2">
                <Link
                  to={`/blogs/${blog.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  View
                </Link>
                <button
                  disabled={actionId === blog.id}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-900 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => action(approveBlog, blog.id)}
                >
                  Approve
                </button>
                <button
                  disabled={actionId === blog.id}
                  className="cursor-pointer rounded-md border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => action(rejectBlog, blog.id)}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
          {!blogs.length && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No pending blogs for review.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">
          Author Applications
        </h2>
        <div className="mt-3 space-y-3">
          {applications.map((item) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              key={item.id}
            >
              <div>
                <p className="font-medium text-gray-900">
                  {item.user_name || `User #${item.user_id}`}
                </p>
                <p className="text-sm text-gray-600">Reason: {item.reason}</p>
              </div>
              <span className="flex items-center gap-2">
                <button
                  disabled={actionId === item.id}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-900 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => action(acceptApplication, item.id)}
                >
                  Accept
                </button>
                <button
                  disabled={actionId === item.id}
                  className="cursor-pointer rounded-md border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => action(rejectApplication, item.id)}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
          {!applications.length && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No pending applications for review.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
export default Admin;
