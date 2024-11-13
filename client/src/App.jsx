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
    </div>
  );
}

export default App;
