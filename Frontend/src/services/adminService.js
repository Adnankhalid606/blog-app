import api from "./api";

export const getPendingBlogs = () => api.get("/admin/blogs/pending");
export const getPendingBlogById = (id) => api.get(`/admin/blogs/pending/${id}`);
export const approveBlog = (id) => api.put(`/admin/blogs/${id}/approve`);
export const rejectBlog = (id) => api.put(`/admin/blogs/${id}/reject`);
export const getPendingApplications = () =>
  api.get("/author/application/pending");
export const acceptApplication = (id) =>
  api.patch(`/author/application/${id}/accept`);
export const rejectApplication = (id) =>
  api.patch(`/author/application/${id}/reject`);
