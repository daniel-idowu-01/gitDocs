import React from "react";

const Nav = () => {
  return (
    <nav className="flex justify-between items-center p-5 px-8 bg-white shadow-md">
      <div className="flex items-center">
        <h1 className="doto-font text-2xl">GitDocs</h1>
      </div>
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/daniel-idowu-01/gitDocs"
          target="_blank"
          className="hidden md:block px-6 py-2 border border-[#ff7f50] text-[#ff7f50] rounded-full font-semibold"
        >
          Contribute
        </a>
        {/* <button href="#" className="text-gray-700 font-semibold">
          Log in
        </button> */}
        <button
          href="#"
          className="px-6 py-2 bg-[#ff7f50] text-white rounded-full font-semibold"
        >
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default Nav;
