import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../services/blogService";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/imageUrl";
import MarkdownPreview from "../components/MarkdownPreview";

function BlogDetails() {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getBlogById(id);
        setBlog(response.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
  if (loading)
    return (
      <div className="flex h-dvh items-center justify-center">
        <span className="loader" />
      </div>
    );
  if (!blog)
    return (
      <p className="mt-7 text-center text-xl">{error || "Blog not found"}</p>
    );
  return (
    <article className="mx-auto mt-10 max-w-3xl px-5 pb-16">
      <h1 className="mb-5 text-4xl font-bold">{blog.title}</h1>
      <div className="mb-8 flex justify-between text-sm text-gray-500">
        <span>{blog.author_name || `Author #${blog.author_id}`}</span>
        <span>{formatDate(blog.created_at)}</span>
      </div>
      <img
        src={getImageUrl(blog.image)}
        alt={blog.title}
        className="w-full rounded object-cover"
      />
      <div className="mt-10 text-lg leading-8">
        <MarkdownPreview content={blog.content} />
      </div>
    </article>
  );
}
export default BlogDetails;
