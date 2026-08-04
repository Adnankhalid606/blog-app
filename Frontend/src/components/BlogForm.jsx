import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageUrl";
import MarkdownPreview from "./MarkdownPreview";

function BlogForm({ initialBlog, onSubmit, submitting, error }) {
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [preview, setPreview] = useState("");
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
  }, [initialBlog]);
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const changeImage = (event) => {
    const image = event.target.files?.[0] || null;
    setForm((current) => ({ ...current, image }));
    if (image) setPreview(URL.createObjectURL(image));
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="mx-auto max-w-2xl space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block font-medium">Title</label>
        <input
          required
          name="title"
          value={form.title}
          onChange={change}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="font-medium">Content (Markdown supported)</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm underline"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-64 rounded border border-gray-300 p-3">
            <MarkdownPreview content={form.content} />
          </div>
        ) : (
          <textarea
            required
            name="content"
            value={form.content}
            onChange={change}
            rows="12"
            placeholder={
              "# Heading\n\nUse **bold**, *italic*, `code`, and [links](https://example.com)."
            }
            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
          />
        )}
        <p className="mt-2 text-xs text-gray-500">
          Use # for headings, **bold**, *italic*, `code`, and
          [text](https://example.com) for links.
        </p>
      </div>
      <div>
        <label className="mb-1 block font-medium">Cover image (optional)</label>
        <input
          accept="image/jpeg,image/png,image/webp"
          type="file"
          onChange={changeImage}
          className="block w-full text-sm"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-52 w-full rounded object-cover"
          />
        )}
      </div>
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      <button
        disabled={submitting}
        className="rounded bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save blog"}
      </button>
    </form>
  );
}
export default BlogForm;
