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
        <Link
          to="/"
          className="pacifico-font text-2xl sm:text-4xl text-[#ff7f50] tracking-widest"
        >
          gitdocs
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {pathname !== "/generate-readme" && (
          <Link
            to="/generate-readme"
            className="hidden sm:block px-4 py-2 bg-gradient-to-r from-[#ff7f50] to-[#ff6347] hover:from-[#ff6347] hover:to-[#ff7f50] text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Generate README
          </Link>
        )}
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
