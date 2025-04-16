import Nav from "../Nav";
import Spinner from "./Spinner";
import DocsIcons from "./DocsIcons";
import InsightIcon from "./InsightIcon";
import "react-toastify/dist/ReactToastify.css";
import { formatTime } from "../../utils/helpers";
import RepoInsight from "../../pages/RepoInsight";
import { AuthContext } from "../../utils/authContext";
import { ToastContainer, toast } from "react-toastify";
import { validateGithubUrl } from "../../utils/helpers";
import GenerateDocumentation from "./GenerateDocumentation";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const GenerateReadme = () => {
  const readmeRef = useRef(null);
  const [timer, setTimer] = useState(120);
  const [repoUrl, setRepoUrl] = useState("");
  const [userRepos, setUserRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [readmeContent, setReadmeContent] = useState("");
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);

  const notifyError = () => toast.warn("Enter a valid URL!");
  const notifyCatchError = (error) => toast.warn(error);
  const notifySuccess = () =>
    toast.success("Documentation successfully generated!");

  // useEffect is implemented for timer
  useEffect(() => {
    if (isLoading) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      setIntervalId(id);
    }

    // If time runs out and request is still in progress, extend the timer by 30 seconds
    if (timer === 0 && isLoading) {
      toast.info(
        "Kindly give us an extra 30 seconds to process your documentation"
      );
      setTimer(30);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  // function to generate readme
  const handleRepoUrl = async (e) => {
    e.preventDefault();

    const result = validateGithubUrl(repoUrl);
    if (!result.valid) {
      notifyError();
      return;
    }

    setIsLoading(true);
    setTimer(120);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/docs`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repoUrl,
            method: "readme",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setReadmeContent(data.readme);
      setIsLoading(false);
      if (readmeRef.current) {
        readmeRef.current.onload = () => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        };
      }
      notifySuccess("README generated successfully!");
    } catch (error) {
      setIsLoading(false);
      notifyCatchError(error.message);
      console.error("Error:", error);
    }
  };

  // function to search for user repos
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
        })
        .catch((err) => {
          setIsRepoLoading(false);
          console.error("Errrrrrrrrrr", err);
        });
    } else {
      return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readmeContent);
    toast.info("README copied to clipboard!");
  };

  return (
    <main className="background-image-url min-h-screen text-center px-2 pb-10 text-gray-200">
      <ToastContainer />
      <Nav />
      <div className="flex justify-center mt-10 md:mt-20"></div>
      <h1
        style={{ lineHeight: "3rem" }}
        className="relative text-3xl md:text-4xl font-bold mb-4 z-50 text-gray-200"
      >
        Generate Professional README Files
      </h1>
      <p className="relative z-50 md:text-xl mb-8 w-[90%] sm:w-[65%] mx-auto">
        Create beautiful, standardized READMEs for your GitHub repositories with
        one click
      </p>
      <div className="flex justify-center space-x-4 mb-5"></div>

      {/* Generate Documentation Section */}
      <GenerateDocumentation
        searchUserRepos={searchUserRepos}
        setRepoUrl={setRepoUrl}
        repoUrl={repoUrl}
        userRepos={userRepos}
        isRepoLoading={isRepoLoading}
        isLoading={isLoading}
        handleRepoUrl={handleRepoUrl}
        timer={timer}
      />

      {readmeContent && (
        <section
          ref={readmeRef}
          className="bg-white text-black m-10 p-10 rounded-lg shadow-md mt-10"
        >
          <article className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your README</h2>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition"
            >
              Copy to Clipboard
            </button>
          </article>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {readmeContent}
          </pre>
          <div className="mt-4 text-sm text-gray-500">
            <p>Paste this content into your README.md file</p>
          </div>
        </section>
      )}
    </main>
  );
};

export default GenerateReadme;
