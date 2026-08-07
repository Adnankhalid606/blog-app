import api from "./api";

export function getAllBlogs({ page = 1, limit = 10, search = "" } = {}) {
  return api.get("/blogs", { params: { page, limit, search } });
}
export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const createBlog = (formData) =>
  api.post("/blogs/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateBlog = (id, data) =>
  api.put(`/blogs/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const getMyBlogs = () => api.get("/blogs/me");
export const submitBlog = (id) => api.patch(`/blogs/${id}/publish`);
