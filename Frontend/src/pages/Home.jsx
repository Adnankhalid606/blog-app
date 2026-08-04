import { useEffect, useState } from "react";
import { getAllBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getAllBlogs({ page, search: query });
        setBlogs(response.data.blogs || []);
        setTotalPages(response.data.totalPages || 1);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [page, query]);
  const searchBlogs = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(search);
  };
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Exploring New Blogs</h1>
        <p className="mt-2 text-gray-600">
          Ideas, trends, and inspiration for a brighter future
        </p>
        <form
          onSubmit={searchBlogs}
          className="mx-auto mt-6 flex max-w-lg gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <button className="rounded bg-black px-5 py-2 text-white">
            Search
          </button>
        </form>
      </div>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <span className="loader" />
        </div>
      ) : error ? (
        <p className="text-center text-red-700">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-xl">No blogs found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}
export default Home;
