import React, { useContext } from "react";
import { AuthContext } from "../utils/authContext";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center p-5 md:px-20 sm:py-6">
      <div className="flex items-center">
        <h1 className="pacifico-font text-2xl sm:text-4xl text-[#ff7f50] tracking-widest">
          gitdocs
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* <button href="#" className="text-gray-700 font-semibold">
          Log in
        </button> */}
        {isAuthenticated ? (
          <img
            src={user?.profileUrl || user?.githubProfileUrl}
            className="w-10 rounded-full"
            alt=""
          />
        ) : (
          <div className="shadow-2xl hover:cursor-pointer">
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/api/auth/github`}
              className="px-4 md:px-6 py-3 text-xs sm:text-base bg-gray-200 hover:bg-[#ffffffb4] text-[#031f39] rounded-full font-semibold"
            >
              Connect Github
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
