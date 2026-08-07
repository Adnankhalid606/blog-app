import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MarkdownPreview from "../components/MarkdownPreview";
import { approveBlog, getPendingBlogById, rejectBlog } from "../services/adminService";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/imageUrl";

function AdminBlogPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    getPendingBlogById(id)
      .then((res) => {
        if (isMounted) setBlog(res.data.blog);
      })
      .catch((err) => {
        if (isMounted)
          setError(err.response?.data?.message || "Failed to load blog preview.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setError("");
    try {
      await approveBlog(id);
      setMessage("Blog approved successfully!");
      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve blog.");
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError("");
    try {
      await rejectBlog(id);
      setMessage("Blog rejected.");
      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject blog.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading blog preview...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error || "Blog not found."}
        </div>
        <Link
          to="/admin"
          className="mt-4 inline-block text-sm font-semibold text-gray-700 hover:text-black"
        >
          &larr; Back to Admin Panel
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Top Banner & Nav */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <Link
          to="/admin"
          className="text-sm font-semibold text-gray-700 hover:text-black"
        >
          &larr; Back to Admin Panel
        </Link>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Status: {blog.status}
          </span>
          {blog.status === "pending" && (
            <>
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="cursor-pointer rounded-md bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
          {message}
        </div>
      )}

      {/* Main Preview Container */}
      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {blog.image && (
          <img
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="mb-6 max-h-96 w-full rounded object-cover"
          />
        )}

        <h1 className="mb-2 text-3xl font-bold text-gray-900">{blog.title}</h1>

        <div className="mb-6 flex items-center justify-between text-sm text-gray-500 border-b pb-4">
          <span>By {blog.author_name || `Author #${blog.author_id}`}</span>
          <span>Submitted: {formatDate(blog.created_at)}</span>
        </div>

        <MarkdownPreview content={blog.content} />
      </article>
    </div>
  );
}

export default AdminBlogPreview;
