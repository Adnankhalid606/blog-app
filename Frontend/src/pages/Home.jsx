import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data.blogs);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return <h1 className="text-center text-3xl font-semibold mt-7">{error}</h1>;
  }

  if (blogs.length === 0) {
    return (
      <h1 className="text-center text-3xl font-semibold mt-7">
        No Blogs Found
      </h1>
    );
  }
  return (
    <>
      <div className="text-center h-48 flex flex-col justify-center">
        <h1 className="text-4xl font-bold">Exploring New Blogs</h1>
        <p className="text-2xl mt-2 font-light">Ideas, trends, and inspiration for a brighter future</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <div className="flex justify-center h-48 items-center">
        <button className="border rounded border-gray-400 py-3 px-5 hover:bg-gray-300 transition-colors duration-300 cursor-pointer ">
          Load More
        </button>
      </div>
    </>
  );
}

export default Home;
