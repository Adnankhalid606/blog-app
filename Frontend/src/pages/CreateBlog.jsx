import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { createBlog } from "../services/blogService";
function CreateBlog() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const save = async (blog) => {
    setSubmitting(true);
    setError("");
    try {
      const data = new FormData();
      data.append("title", blog.title);
      data.append("content", blog.content);
      if (blog.image) data.append("image", blog.image);
      await createBlog(data);
      navigate("/my-blogs");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="px-5 py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">Create blog</h1>
      <BlogForm onSubmit={save} submitting={submitting} error={error} />
    </main>
  );
}
export default CreateBlog;
