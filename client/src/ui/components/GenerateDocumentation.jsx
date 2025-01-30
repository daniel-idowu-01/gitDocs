import React from "react";
import Spinner from "./Spinner";
import { formatTime } from "../../utils/helpers";

const GenerateDocumentation = ({
  searchUserRepos,
  setRepoUrl,
  repoUrl,
  userRepos,
  isRepoLoading,
  isLoading,
  handleRepoUrl,
  timer,
}) => {
  return (
    <article className="relative z-50 bg-white text-[#031f39] rounded-3xl p-10 max-w-2xl mx-auto mt-5">
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
          } w-full p-2 py-3 border border-gray-300 rounded outline-none`}
          placeholder="https://github.com/username/project"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          autoFocus
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
        } w-full py-3 text-white rounded font-semibold flex items-center justify-center gap-2`}
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
  );
};

export default GenerateDocumentation;
