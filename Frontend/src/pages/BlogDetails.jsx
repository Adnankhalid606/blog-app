import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogById } from "../services/blogService";
import { formatDate } from "../utils/formatDate";

function BlogDetails() {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  
  const { id } = useParams();

  useEffect(() => {
    const fetchBlogById = async () => {
      try {
        const response = await getBlogById(id);
        setBlog(response.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="loader"></span>
      </div>
    );
  }
  if(!blog) return <h1 className="text-center text-3xl font-semibold mt-7">Blog not found</h1>;
  return (
    <>
      <article className="mt-10">
      {/* section 1  || Title and Author Information*/}
       <div className="mx-auto w-full p-8 lg:w-1/2 lg:p-0">
        <h1 className="text-4xl mb-5">{blog.title}</h1>
        <div className="flex justify-between">
          <span className="flex items-center gap-4">
            <img src={blog.image} alt="Author Image" className="h-10 w-10 rounded-full overflow-hidden" />
            <span>
              <p>{blog.author_id}</p>
              <p className="text-gray-400">Author</p>
            </span>
          </span>
          <span>
            <p className="font-bold text-gray-400">{formatDate(blog.created_at)}</p>
          </span>
        </div>
       </div>

       {/* section 2 || Blog Content */}
       <div className="mx-auto w-full p-8 lg:w-1/2 lg:p-0 mt-20">
        <img src={blog.image} alt={blog.title} className="overflow-hidden rounded" />
        <p className="mt-10">{blog.content}</p>
       </div>

      </article>
    </>
  );
}

export default BlogDetails;
