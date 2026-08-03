import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import BlogDetails from "../pages/BlogDetails";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "blogs/:id",
        element: <BlogDetails />
      },
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
        element: <Register />,
      },
      {
        path: "profile",
        element: (
        <ProtectedRoute>
        <Profile />
        </ProtectedRoute>
      ),
      },
    ],
  },
]);

export default router;
