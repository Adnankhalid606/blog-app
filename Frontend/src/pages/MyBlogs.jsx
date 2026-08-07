import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBlog, getMyBlogs, submitBlog } from "../services/blogService";
function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const load = async () => {
    try {
      setError("");
      const res = await getMyBlogs();
      setBlogs(res.data.blogs || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setDeletingId(id);
    setError("");
    setSuccessMessage("");
    try {
      await deleteBlog(id);
      setSuccessMessage("Blog deleted successfully.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const submit = async (id) => {
    setSubmittingId(id);
    setError("");
    setSuccessMessage("");
    try {
      await submitBlog(id);
      setSuccessMessage("Blog submitted for approval successfully.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loader" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your draft and published blog posts
          </p>
        </div>
        <Link
          to="/blogs/create"
          className="cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 transition-colors"
        >
          Create Blog
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">You haven't created any blogs yet.</p>
          <Link
            to="/blogs/create"
            className="mt-4 inline-block cursor-pointer text-sm font-semibold text-gray-900 underline hover:text-gray-700"
          >
            Write your first blog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {blog.title}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    Status:{" "}
                    <span
                      className={`font-medium capitalize ${
                        blog.status === "published"
                          ? "text-green-700"
                          : blog.status === "pending"
                          ? "text-amber-700"
                          : "text-gray-700"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {blog.status === "published" && (
                  <Link
                    to={`/blogs/${blog.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    View
                  </Link>
                )}
                <Link
                  to={`/blogs/${blog.id}/edit`}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                {blog.status === "draft" && (
                  <button
                    disabled={submittingId === blog.id}
                    onClick={() => submit(blog.id)}
                    className="cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingId === blog.id ? "Submitting..." : "Submit"}
                  </button>
                )}
                <button
                  disabled={deletingId === blog.id}
                  onClick={() => remove(blog.id)}
                  className="cursor-pointer rounded-md border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === blog.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
export default MyBlogs;
