import { useState, useEffect } from "react";
import { validateGithubUrl } from "./utils/helpers";

function App() {
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
    <div>
      <header className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white text-center">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">iGram</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">FAQ</div>
            <div className="flex items-center space-x-1">
              <i className="fas fa-flag-usa"></i>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-center space-x-4">
            <button className="bg-pink-600 text-white py-2 px-4 rounded">
              Video
            </button>
            <button className="bg-pink-600 text-white py-2 px-4 rounded">
              Photo
            </button>
            <button className="bg-pink-600 text-white py-2 px-4 rounded">
              Story
            </button>
            <button className="bg-pink-600 text-white py-2 px-4 rounded">
              Reels
            </button>
            <button className="bg-pink-600 text-white py-2 px-4 rounded">
              IGTV
            </button>
          </div>
          <h1 className="text-4xl font-bold mt-6">Instagram Downloader</h1>
          <p className="mt-2">
            Download Video, Reels, Photo, IGTV, carousel from Instagram
          </p>
          <div className="mt-6 flex justify-center">
            <input
              type="text"
              placeholder="Insert instagram link here"
              className="p-4 rounded-l-lg w-1/2"
            />
            <button className="bg-gray-200 text-gray-700 p-4 rounded-r-lg flex items-center">
              <i className="fas fa-paste mr-2"></i> Paste
            </button>
            <button className="bg-blue-500 text-white p-4 rounded-lg ml-2">
              Download
            </button>
          </div>
        </div>
      </header>
      <main className="p-6">
        <h2 className="text-3xl font-bold text-center text-purple-700">
          HOW TO DOWNLOAD VIDEO FROM INSTAGRAM?
        </h2>
        <div className="mt-6 flex justify-center items-start space-x-6">
          <div className="w-1/3">
            <img
              src="https://placehold.co/300x300"
              alt="Instagram post with a copy link button"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="w-2/3">
            <div className="flex items-start space-x-4">
              <div className="text-4xl text-pink-500 font-bold">1</div>
              <div>
                <h3 className="text-2xl font-bold">Copy the URL</h3>
                <p className="mt-2">
                  To get started, access either the Instagram app or website and
                  retrieve the link to the specific video, reels, carousel, or
                  IGTV content that you want to copy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

{/* <div>
  <input
    type="text"
    placeholder="Repo link"
    className="border-2 text-black m-20 mr-0 px-3 py-2 w-80"
    value={repoUrl}
    onChange={(e) => setRepoUrl(e.target.value)}
  />
  <button
    onClick={handleRepoUrl}
    className="bordeer bg-red-500 w-20 text-white p-3"
  >
    Submit
  </button>
</div>;
 */}