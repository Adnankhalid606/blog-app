import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { getMyBlogs, updateBlog } from "../services/blogService";
function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    getMyBlogs()
      .then((res) =>
        setBlog(
          (res.data.blogs || []).find((item) => String(item.id) === id) || null,
        ),
      )
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, [id]);
  const save = async (data) => {
    setSubmitting(true);
    try {
      await updateBlog(id, { title: data.title, content: data.content });
      navigate("/my-blogs");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (!blog && !error)
    return (
      <div className="py-20">
        <span className="loader" />
      </div>
    );
  return (
    <main className="px-5 py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">Edit blog</h1>
      {blog ? (
        <BlogForm
          initialBlog={blog}
          onSubmit={save}
          submitting={submitting}
          error={error}
        />
      ) : (
        <p className="text-center text-red-700">{error || "Blog not found"}</p>
      )}
    </main>
  );
}
export default EditBlog;
