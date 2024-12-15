import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/authContext";

const Nav = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  /* console.log("isAuthenticated", isAuthenticated);
  console.log("user", user); */ //USER.PROFILE.PROFILEURL OR USER.GITHUBPROFILEURL

  return (
    <nav className="flex justify-between items-center p-5 px-8 ">
      <div className="flex items-center">
        <h1 className="doto-font text-2xl text-gray-300 uppercase tracking-widest">
          GitDocs
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/daniel-idowu-01/gitDocs"
          target="_blank"
          className="hidden md:block px-6 py-2 border border-[#ff7f50] hover:border-[#ff7f50cb] text-[#ff7f50] hover:text-[#ff7f50cb] rounded-full font-semibold"
        >
          Contribute
        </a>
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
          <Link
            to="/signup"
            className="px-6 py-2 bg-[#ff7f50] hover:bg-[#ff7f50cb] text-white rounded-full font-semibold"
          >
            Sign up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
