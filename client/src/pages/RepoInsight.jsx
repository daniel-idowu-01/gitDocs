import React, { useState, useContext, useRef, useEffect } from "react";
import { validateGithubUrl } from "../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../utils/authContext";
import Nav from "../ui/Nav";
import Spinner from "../ui/components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import RepoChart from "../ui/components/RepoChart";

const RepoInsight = () => {
  const chartRef = useRef(null);
  const [commitData, setCommitData] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);

  const notifyError = () => toast.warn("Enter a valid URL!");
  const notifyCatchError = (error) => toast.warn(error);

  const handleRepoUrl = (e) => {
    e.preventDefault();
    const result = validateGithubUrl(repoUrl);
    if (!result.valid) {
      notifyError();
      return;
    }

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/docs/repos/commits`, {
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
          if (response.status == 404) {
            notifyCatchError(`Repository Not Found`);
          } else {
            return Promise.reject("Failed to fetch");
          }
        }
        setIsLoading(false);
        return response.json();
      })
      .then((data) => {
        setCommitData(data.data);
      })
      .catch((error) => {
        setIsLoading(false);
        notifyCatchError(`${error}`);
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (commitData && chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [commitData]);

  // Alternative scrolling
  useEffect(() => {
    if (commitData && chartRef.current) {
      const chartPosition = chartRef.current.offsetTop;
      window.scrollTo({
        top: chartPosition,
        behavior: "smooth",
      });
    }
  }, [commitData]);

  return (
    <main className="bg-[#031f39] text-white text-center px-2 pb-10 hide-scrollbar mt-5">
      <ToastContainer />
      <article className="relative z-50 bg-white text-[#031f39] rounded-2xl p-10 max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Visualize Repository Analytics and Activity
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
            className={`w-full p-2 py-3 border border-gray-300 rounded`}
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
          } w-full py-3 text-white rounded font-semibold flex items-center justify-center gap-2 mt-2`}
        >
          {isLoading && <Spinner />}
          {isLoading ? "Getting" : "Get Insight"}
        </button>
      </article>

      <div
        ref={chartRef}
        className={`${
          !commitData ? "hidden" : "flex"
        } justify-center mt-10 z-50`}
      >
        {commitData && <RepoChart commitData={commitData} />}
      </div>
    </main>
  );
};

export default RepoInsight;
