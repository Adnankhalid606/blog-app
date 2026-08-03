import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

function BlogCard({ blog }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition ease-in-out  duration-300">
      <img src={blog.image} alt={blog.title} className="overflow-hidden rounded" />
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-4 items-center">
        <img src={blog.image} alt="author Pic" className="w-8 h-8  rounded-full" />
        <p >{blog.author_id}</p>
        </div>
        <p className="text-gray-400">{formatDate(blog.created_at)}</p>
      </div>
      <h2 className="text-2xl line-clamp-2">{blog.title}</h2>
      <p className="line-clamp-3">{blog.content}</p>
      <Link to={`/blogs/${blog.id}`} className="border rounded border-gray-200 py-3 px-5 self-start bg-gray-200 hover:bg-gray-300 transition-colors duration-300 cursor-pointer ">Read More </Link>
    </article>
  );
}

export default BlogCard;
