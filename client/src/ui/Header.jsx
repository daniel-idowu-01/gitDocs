import Nav from "./Nav";
import DocsIcons from "./components/DocsIcons";
import RepoInsight from "../pages/RepoInsight";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../utils/authContext";
import InsightIcon from "./components/InsightIcon";
import { validateGithubUrl } from "../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect, useContext, useRef } from "react";
import GenerateDocumentation from "./components/GenerateDocumentation";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const Header = () => {
  const iframeRef = useRef(null);
  const [timer, setTimer] = useState(120);
  const [pdfUrl, setPdfUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [active, setActive] = useState("docs");
  const [userRepos, setUserRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);

  const notifyError = () => toast.warn("Enter a valid URL!");
  const notifyCatchError = (error) => toast.warn(error);
  const notifySuccess = () =>
    toast.success("Documentation successfully generated!");

  // useEffect is implemented for timer
  useEffect(() => {
    let id = null;

    if (isLoading) {
      id = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            toast.info(
              "Kindly give us an extra 30 seconds to process your documentation"
            );
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isLoading]);

  // function to generate documentation
  const handleRepoUrl = (e) => {
    e.preventDefault();

    const result = validateGithubUrl(repoUrl);
    if (!result.valid) {
      notifyError();
      return;
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
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
        method: "repo",
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
        setPdfUrl(url);
        if (iframeRef.current) {
          iframeRef.current.onload = () => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          };
        }
      })
      .catch((error) => {
        setIsLoading(false);
        notifyCatchError(`${error}`);
        console.error("Error:", error);
      });
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

  return (
    <main className="background-image-url text-center px-2 pb-10 text-gray-200">
      <ToastContainer />
      <Nav />
      {/* Header Body Content */}
      <div className="flex justify-center mt-10 md:mt-20">
        {/* <img
          className="absolute mx-auto top-32 w-[40rem] z-10 opacity-50 brightness-150"
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt=""
        /> */}
      </div>
      <h1
        style={{ lineHeight: "3rem" }}
        className="relative text-3xl md:text-4xl font-bold mb-4 z-50 text-gray-200"
      >
        Automate Your Repo Documentation & Gain Actionable Insights
      </h1>
      <p className="relative z-50 md:text-xl mb-8 w-[90%] sm:w-[65%] mx-auto">
        Seamlessly generate comprehensive documentation and deep insights for
        any GitHub repository. Simplify onboarding, enhance project
        transparency, and track key repository metrics—all in one place
      </p>
      <div className="flex justify-center space-x-4 mb-5"></div>

      {/* docs & insights links */}
      <section className="flex items-center gap-5 justify-center">
        <article
          className={`${
            active == "docs" && "border-2 border-[#ff7f50]"
          } text-[#031f39] bg-white flex items-center gap-1  hover:bg-gray-200 hover:cursor-pointer rounded-2xl px-6 py-4`}
          onClick={() => setActive("docs")}
        >
          <DocsIcons />
          <p className="font-bold">Docs</p>
        </article>
        <article
          className={`${
            active == "insight" && "border-2 border-[#ff7f50]"
          } text-[#031f39] bg-white flex items-center gap-1  hover:bg-gray-200 hover:cursor-pointer rounded-2xl px-6 py-4`}
          onClick={() => setActive("insight")}
        >
          <InsightIcon />
          <p className="text-[#031f39] font-bold">Insight</p>
        </article>
      </section>

      {/* Generate Documentation & Repository Insight Section */}
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={active}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div className="transition-container">
            {active === "docs" ? (
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
            ) : (
              <RepoInsight />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>

      {/* Footer */}

      <div className={`${!pdfUrl ? "hidden" : "flex"} justify-center mt-10`}>
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          width="100%"
          height="600px"
        ></iframe>
      </div>
    </main>
  );
};

export default Header;
