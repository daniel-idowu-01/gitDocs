import React from "react";
import { useState, useEffect } from "react";
import { validateGithubUrl } from "../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "./components/Spinner";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const notifyError = () => toast.warn("Enter a valid URL!");
  const notifySuccess = () => toast.success("Documentation successfully generated!");

  // Handle form submission
  const handleRepoUrl = (e) => {
    e.preventDefault();

    const result = validateGithubUrl(repoUrl);

    if (!result.valid) {
      notifyError();
      return;
    }

    setIsLoading(true);
    fetch("http://localhost:8000/api/docs", {
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
        setIsLoading(false);
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <main className="bg-[#031f39] text-white text-center py-32">
      <ToastContainer />
      <div className="flex justify-center">
        <img
          className="absolute mx-auto top-32 w-[40rem] z-10 opacity-50 brightness-150"
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt=""
        />
      </div>
      <h1 className="relative text-4xl font-bold mb-4 z-50">
        Transform Your GitHub Repositories into Professional Documentation
      </h1>
      <p className="relative z-50 text-lg mb-8">
        Turn your GitHub projects into polished, ready-to-share documentation
        with just one click.
      </p>
      <div className="flex justify-center space-x-4 mb-8"></div>
      <article className="relative z-50 bg-white text-[#031f39] rounded-2xl p-10 max-w-2xl mx-auto">
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
          disabled={!repoUrl.trim() || isLoading}
          onClick={handleRepoUrl}
          className={`${
            !repoUrl.trim() || isLoading ? "bg-[#e6e6e6]" : "bg-[#ff7f50]"
          } w-full py-3  text-white rounded font-semibold flex items-center justify-center gap-2`}
        >
          {isLoading && <Spinner />}
          {isLoading ? "Generating" : "Generate"}
        </button>
      </article>
    </main>
  );
};

export default Header;
