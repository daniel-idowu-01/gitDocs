import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/authContext";
import Header from "../ui/Header";

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div className="bg-[#031f39]">
      {!isAuthenticated && (
        <div className="absolute bottom-10 right-10 shadow-2xl hover:transition-all hover:w-40 hover:cursor-pointer group w-10 h-10">
          <img
            className="absolute inset-0 z-10 w-full h-full object-contain bg-white rounded-full group-hover:opacity-0 transition-opacity duration-100"
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt="Github Logo"
          />
          <a
            href="http://localhost:5000/api/auth/github"
            className="absolute inset-0 text-sm flex items-center justify-center z-20 text-white bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"
          >
            Connect Github
          </a>
        </div>
      )}

      <Header />
    </div>
  );
};

export default Home;
