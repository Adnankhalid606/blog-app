import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout, loading } = useAuth();
  if(loading){
    return <p>Loading.... </p>
  }
  const NavLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Blog",
      path: "/blogs",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];
  return (
    <nav className="p-5">
      <div className="flex justify-between max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl">Logo Here</h1>
        </div>

        <div className="flex gap-5">
          <div className="flex gap-4 items-center">
            {NavLinks.map((link) => {
              return (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-blue-500 ${isActive ? "text-blue-500" : "text-black"}`
                  }
                  key={link.path}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <p className="flex flex-col">
                  <span className="font-bold">{user?.username}</span>
                  <span>{user?.role}</span>
                </p>
                <button
                  onClick={logout}
                  className="border rounded border-gray-300 py-2 px-5 shadow-sm hover:border-gray-500 cursor-pointer transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to={"/login"}
                  className="border rounded border-gray-300 py-2 px-5 shadow-sm hover:border-gray-500 cursor-pointer transition-colors duration-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to={"/register"}
                  className="border rounded bg-black text-white py-2 px-5 shadow-sm hover:bg-gray-800 cursor-pointer transition-colors duration-300"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
