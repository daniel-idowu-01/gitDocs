import React, { useState, useEffect } from "react";
import { validateGithubUrl } from "../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "./components/Spinner";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [intervalId, setIntervalId] = useState(null);

  const notifyError = () => toast.warn("Enter a valid URL!");
  const notifyCatchError = (error) => toast.warn(error);
  const notifySuccess = () =>
    toast.success("Documentation successfully generated!");

  // Timer countdown logic with iterative extension
  useEffect(() => {
    if (isLoading) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Store the interval ID to clear it when needed
      setIntervalId(id);
    }

    // If time runs out and request is still in progress, extend the timer by 30 seconds
    if (timer === 0 && isLoading) {
      toast.info(
        "Kindly give us an extra 30 seconds to process your documentation"
      );
      setTimer(30);
    }

    // Cleanup the interval when the timer is no longer active
    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading, timer]);

  const handleRepoUrl = (e) => {
    e.preventDefault();

    const result = validateGithubUrl(repoUrl);
    if (!result.valid) {
      notifyError();
      return;
    }

    setIsLoading(true);
    setTimer(120);

    fetch("http://localhost:5000/api/docs", {
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
        notifySuccess();
        setIsLoading(false);
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => {
        setIsLoading(false);
        notifyCatchError(`${error}`);
        console.error("Error:", error);
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <main className="bg-[#031f39] text-white text-center py-14 md:py-32 px-2">
      <ToastContainer />
      <div className="flex justify-center">
        <img
          className="absolute mx-auto top-32 w-[40rem] z-10 opacity-50 brightness-150"
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt=""
        />
      </div>
      <h1 className="relative text-3xl md:text-4xl font-bold mb-4 z-50">
        Transform Your GitHub Repositories into Professional Documentation
      </h1>
      <p className="relative z-50 md:text-lg mb-8">
        Turn your GitHub projects into polished, ready-to-share documentation
        with just one click.
      </p>
      <div className="flex justify-center space-x-4 mb-8"></div>
      <article className="relative z-50 bg-white text-[#031f39] rounded-2xl p-10 max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
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

        {/* Timer Display */}
        {isLoading && (
          <div className="mt-4 text-sm">
            Your documentation will be generated in: {formatTime(timer)}
          </div>
        )}
      </article>
    </main>
  );
};

export default Header;