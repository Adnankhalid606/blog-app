import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/imageUrl";
function BlogCard({ blog }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={getImageUrl(blog.image)}
        alt={blog.title}
        className="h-48 w-full rounded object-cover"
      />
      <div className="flex items-center justify-between text-sm">
        <span>{blog.author_name || `Author #${blog.author_id}`}</span>
        <span className="text-gray-500">{formatDate(blog.created_at)}</span>
      </div>
      <h2 className="text-xl font-semibold line-clamp-2">{blog.title}</h2>
      <p className="line-clamp-3 text-gray-700">{blog.content}</p>
      <Link
        to={`/blogs/${blog.id}`}
        className="mt-auto self-start rounded border px-4 py-2"
      >
        Read more
      </Link>
    </article>
  );
}
export default BlogCard;
