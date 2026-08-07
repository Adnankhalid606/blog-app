import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageUrl";
import MarkdownPreview from "./MarkdownPreview";

function BlogForm({ initialBlog, onSubmit, submitting, error, successMessage }) {
  const [form, setForm] = useState(() => ({
    title: initialBlog?.title || "",
    content: initialBlog?.content || "",
    image: null,
  }));
  const [preview, setPreview] = useState(() =>
    initialBlog?.image ? getImageUrl(initialBlog.image) : ""
  );
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialBlog) {
      setForm({
        title: initialBlog.title || "",
        content: initialBlog.content || "",
        image: null,
      });
      setPreview(getImageUrl(initialBlog.image));
    }
  }, [initialBlog?.id]);

  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const changeImage = (event) => {
    const image = event.target.files?.[0] || null;
    setForm((current) => ({ ...current, image }));
    if (image) {
      setPreview(URL.createObjectURL(image));
    } else if (!initialBlog?.image) {
      setPreview("");
    }
  };

  const removeImage = () => {
    setForm((current) => ({ ...current, image: null }));
    if (initialBlog?.image) {
      setPreview(getImageUrl(initialBlog.image));
    } else {
      setPreview("");
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="mx-auto max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Title
        </label>
        <input
          required
          name="title"
          value={form.title}
          onChange={change}
          placeholder="Enter blog title"
          className="w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-800 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Content (Markdown supported)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="cursor-pointer text-xs font-semibold text-gray-600 underline hover:text-gray-900 transition-colors"
          >
            {showPreview ? "Edit Mode" : "Preview Markdown"}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-64 rounded-md border border-gray-300 bg-gray-50 p-4">
            <MarkdownPreview content={form.content || "*Nothing to preview yet.*"} />
          </div>
        ) : (
          <textarea
            required
            name="content"
            value={form.content}
            onChange={change}
            rows="12"
            placeholder={
              "# Heading\n\nWrite your blog content here using Markdown...\n\nUse **bold**, *italic*, `code`, and [links](https://example.com)."
            }
            className="w-full rounded-md border border-gray-300 px-3.5 py-2 font-mono text-sm text-gray-800 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        )}
        <p className="mt-1.5 text-xs text-gray-500">
          Tip: Supports Markdown syntax (# headings, **bold**, *italic*, `code`, [links](url))
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Cover Image (Optional)
        </label>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <input
            accept="image/jpeg,image/png,image/webp"
            type="file"
            onChange={changeImage}
            className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-gray-900 transition-colors"
          />
          {preview && (
            <div className="relative mt-4">
              <img
                src={preview}
                alt="Selected cover preview"
                className="h-56 w-full rounded-md border border-gray-200 object-cover shadow-sm"
              />
              {form.image && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 cursor-pointer rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Remove selected file
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3.5 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <button
        disabled={submitting}
        className="w-full cursor-pointer rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Saving..." : initialBlog ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}
export default BlogForm;
