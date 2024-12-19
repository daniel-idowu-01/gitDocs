import React, { useState, useEffect, useContext } from "react";
import { validateGithubUrl } from "../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "./components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import { formatTime } from "../utils/helpers";
import Nav from "./Nav";
import { AuthContext } from "../utils/authContext";

const Header = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [userRepos, setUserRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [intervalId, setIntervalId] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);

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

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/docs`, {
      method: "POST",
      credentials: "include",
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

  const searchUserRepos = () => {
    if (isAuthenticated) {
      setIsRepoLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/docs/user/repos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubUrl: user.githubUrl,
        }),
      })
        .then((res) => {
          setIsRepoLoading(false);
          return res.json();
        })
        .then((data) => {
          setUserRepos(data.repos);
          console.log("daa", data);
        })
        .catch((err) => {
          setIsRepoLoading(false);
          console.log("Errrrrrrrrrr", err);
        });
    } else {
      return null;
    }
  };

  return (
    <main className="text-white text-center px-2 min-h-screen pb-10">
      <ToastContainer />
      <Nav />
      {/* Header Body Content */}
      <div className="flex justify-center">
        <img
          className="absolute mx-auto top-32 w-[40rem] z-10 opacity-50 brightness-150"
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt=""
        />
      </div>
      <h1
        style={{ lineHeight: "3.5rem" }}
        className="relative text-3xl md:text-5xl font-bold mb-4 md:mt-20 z-50"
      >
        <span className="text-[#ff7f50]">Transform</span> Your GitHub
        Repositories into <br />
        Professional Documentation
      </h1>
      <p className="relative z-50 md:text-lg mb-8">
        Turn your GitHub projects into polished, ready-to-share documentation
        with just one click.
      </p>
      <div className="flex justify-center space-x-4 mb-5"></div>

      {/* Generate Documentation Section */}
      <article className="relative z-50 bg-white text-[#031f39] rounded-2xl p-10 max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Generate Documentation For Your{" "}
          <span className="underline">GitHub</span> Project
        </h2>
        <p className="text-gray-600 mb-4">
          No credit card required. <b>it's completely free!</b>
        </p>

        {/* Input Section */}
        <div className="mt-10">
          <label className="block text-left mb-2 font-semibold">
            Paste your GitHub repository link here
          </label>
          <input
            type="text"
            onFocus={searchUserRepos}
            className={`${
              !isRepoLoading == false && "mb-4"
            } w-full p-2 py-3 border border-gray-300 rounded`}
            placeholder="https://github.com/username/project"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        {/* This section shows when the user's repos has been fetched */}
        <div
          className={`${
            userRepos?.length > 0 && "h-60 overflow-scroll hide-scrollbar"
          } flex flex-col divide-y-2 mb-4 text-left text-sm `}
        >
          {isRepoLoading ? (
            <span className="mx-auto">
              <Spinner />
            </span>
          ) : (
            Array.isArray(userRepos) &&
            userRepos.map((repo, index) => (
              <article key={index} className="px-4 py-2 underline">
                <p
                  className="hover:cursor-pointer"
                  onClick={() => setRepoUrl(repo)}
                >
                  {repo}
                </p>
              </article>
            ))
          )}
        </div>

        {/* The button that sends the request */}
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
