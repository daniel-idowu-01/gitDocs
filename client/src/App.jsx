import { useState, useEffect } from "react";

function App() {
  const [githubLink, setGithubLink] = useState("");

  // Handle form submission
  const handleGithubLink = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        githubUrl: githubLink,
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
        placeholder="GitHub link"
        className="border-2 text-black m-20 px-3 py-2 w-80"
        value={githubLink} // Make input controlled by state
        onChange={(e) => setGithubLink(e.target.value)} // Update state on change
      />
      <button onClick={handleGithubLink}>Submit</button>
    </div>
  );
}

export default App;
