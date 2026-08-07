import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import MainLayout from "../layouts/MainLayout";
import BlogDetails from "../pages/BlogDetails";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import CreateBlog from "../pages/CreateBlog";
import EditBlog from "../pages/EditBlog";
import MyBlogs from "../pages/MyBlogs";
import Admin from "../pages/Admin";
import AdminBlogPreview from "../pages/AdminBlogPreview";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
const protectedPage = (page, roles) => (
  <ProtectedRoute roles={roles}>{page}</ProtectedRoute>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blogs/:id", element: <BlogDetails /> },
      {
        path: "login",
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: "verify-email",
        element: (
          <GuestRoute>
            <VerifyEmail />
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        ),
      },
      { path: "profile", element: protectedPage(<Profile />) },
      { path: "dashboard", element: protectedPage(<Dashboard />) },
      {
        path: "my-blogs",
        element: protectedPage(<MyBlogs />, ["author", "admin"]),
      },
      {
        path: "blogs/create",
        element: protectedPage(<CreateBlog />, ["author", "admin"]),
      },
      {
        path: "blogs/:id/edit",
        element: protectedPage(<EditBlog />, ["author", "admin"]),
      },
      { path: "admin", element: protectedPage(<Admin />, ["admin"]) },
      {
        path: "admin/blogs/:id",
        element: protectedPage(<AdminBlogPreview />, ["admin"]),
      },
    ],
  },
]);
export default router;
