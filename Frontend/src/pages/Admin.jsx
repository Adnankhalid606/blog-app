import { useEffect, useState } from "react";
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
    try {
      await fn(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  if (loading)
    return (
      <div className="py-20">
        <span className="loader" />
      </div>
    );
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold">Admin review</h1>
      {error && (
        <p className="mt-3 rounded bg-red-50 p-3 text-red-700">{error}</p>
      )}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Pending blogs</h2>
        <div className="mt-3 space-y-2">
          {blogs.map((blog) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
              key={blog.id}
            >
              <div>
                <p className="font-medium">{blog.title}</p>
                <p className="text-sm text-gray-600">
                  By {blog.author_name || `Author #${blog.author_id}`}
                </p>
              </div>
              <span className="flex gap-2">
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => action(approveBlog, blog.id)}
                >
                  Approve
                </button>
                <button
                  className="rounded border border-red-200 px-3 py-1 text-red-700"
                  onClick={() => action(rejectBlog, blog.id)}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
          {!blogs.length && <p className="text-gray-600">No pending blogs.</p>}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Author applications</h2>
        <div className="mt-3 space-y-2">
          {applications.map((item) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
              key={item.id}
            >
              <div>
                <p className="font-medium">
                  {item.user_name || `User #${item.user_id}`}
                </p>
                <p className="text-sm text-gray-600">{item.reason}</p>
              </div>
              <span className="flex gap-2">
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => action(acceptApplication, item.id)}
                >
                  Accept
                </button>
                <button
                  className="rounded border border-red-200 px-3 py-1 text-red-700"
                  onClick={() => action(rejectApplication, item.id)}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
          {!applications.length && (
            <p className="text-gray-600">No pending applications.</p>
          )}
        </div>
      </section>
    </main>
  );
}
export default Admin;
