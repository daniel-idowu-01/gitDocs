import React from "react";
import { useState, useEffect } from "react";
import { validateGithubUrl } from "../utils/helpers";

const Header = () => {
  const [repoUrl, setRepoUrl] = useState("");

  // Handle form submission
  const handleRepoUrl = (e) => {
    e.preventDefault();

    const result = validateGithubUrl(repoUrl);

    if (!result.valid) {
      alert("URL not valid");
    }

    fetch("http://localhost:3000/api/docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoUrl,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("Failed to fetch");
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <main className="bg-[#031f39] text-white text-center py-32">
      <img
        className="absolute left-10 top-24 w-80 z-10 -rotate-45 opacity-50 brightness-150"
        src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
        alt=""
      />
      <h1 className="relative text-4xl font-bold mb-4 z-50">
        Transform Your GitHub Repositories into Professional Documentation
      </h1>
      <p className="relative z-50 text-lg mb-8">
        Turn your GitHub projects into polished, ready-to-share documentation
        with just one click.
      </p>
      <div className="flex justify-center space-x-4 mb-8"></div>
      <img
        className="absolute right-10 bottom-24 w-20 z-10 rotate-45 opacity-50 brightness-150"
        src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
        alt=""
      />
      <article className="bg-white text-[#031f39] rounded-2xl p-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          Generate Documentation For Your{" "}
          <span className="underline">GitHub</span> Project
        </h2>
        <p className="text-gray-600 mb-4">
          No credit card required. <b>it's completely free!</b>
        </p>

        <div className="mt-10">
          <label className="block text-left mb-2 font-semibold">
            Paste your GitHub repository link here
          </label>
          <input
            type="text"
            className="w-full p-2 py-3 border border-gray-300 rounded mb-4"
            placeholder="https://github.com/username/project"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>
        <button
          onClick={handleRepoUrl}
          className="w-full py-3 bg-[#ff7f50] text-white rounded font-semibold"
        >
          Generate <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </article>
    </main>
  );
};

export default Header;
