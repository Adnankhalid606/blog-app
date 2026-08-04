import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBlog, getMyBlogs, submitBlog } from "../services/blogService";
function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const res = await getMyBlogs();
      setBlogs(res.data.blogs || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const remove = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  const submit = async (id) => {
    try {
      await submitBlog(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My blogs</h1>
        <Link
          to="/blogs/create"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create blog
        </Link>
      </div>
      {error && <p className="mb-4 text-red-700">{error}</p>}
      {blogs.length === 0 ? (
        <p>No blogs yet.</p>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded border p-4"
            >
              <div>
                <h2 className="font-semibold">{blog.title}</h2>
                <p className="text-sm text-gray-500">Status: {blog.status}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/blogs/${blog.id}/edit`}
                  className="rounded border px-3 py-1"
                >
                  Edit
                </Link>
                {blog.status === "draft" && (
                  <button
                    onClick={() => submit(blog.id)}
                    className="rounded border px-3 py-1"
                  >
                    Submit
                  </button>
                )}
                <button
                  onClick={() => remove(blog.id)}
                  className="rounded border border-red-300 px-3 py-1 text-red-700"
                >
                  Delete
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
