import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/imageUrl";
import { stripMarkdown } from "../utils/renderMarkdown";

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
      <p className="line-clamp-3 text-gray-700">{stripMarkdown(blog.content)}</p>
      <Link
        to={`/blogs/${blog.id}`}
        className="mt-auto inline-flex items-center gap-1 self-start cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-900 hover:text-white transition-colors"
      >
        Read blog &rarr;
      </Link>
    </article>
  );
}
export default BlogCard;
