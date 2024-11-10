import axios from "axios";

export default class GithubService {
  constructor() {}

  async extractRepoInfo(repoUrl) {
    const parts = repoUrl.split("https://github.com/");
    if (parts.length > 1) {
      const path = parts[1];
      const [owner, repoName] = path.split("/");
      return { owner, repoName };
    } else {
      console.log("Invalid URL:", repoUrl);
      return null;
    }
  }

  async getRepoData(owner, repoName) {
    try {
      const repoData = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}`,
        { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      );
      return repoData.data;
    } catch (error) {
      console.error("Error fetching repository data:", error);
      return null;
    }
  }

  async getFileContent(owner, repoName, filePath) {
    try {
      const fileData = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`
      );
      // Decode Base64 content
      const content = Buffer.from(fileData.data.content, "base64").toString(
        "utf8"
      );
      return content;
    } catch (error) {
      console.error("Error fetching file content:", error);
      return null;
    }
  }
}
