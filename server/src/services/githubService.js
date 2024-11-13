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
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      return repoData.data;
    } catch (error) {
      console.error("Error fetching repository data:", error);
      return null;
    }
  }

  async getFileContent(owner, repoName, filePath) {
    try {
      // List of file extensions and directories to skip
      const skippedExtensions = [
        ".env",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".bmp",
        ".tiff",
      ];
      const skippedDirs = ["node_modules", "images", "assets", ".git"];

      // Skip if the file path matches any of the skipped extensions or directories
      if (
        skippedExtensions.some((ext) => filePath.endsWith(ext)) ||
        skippedDirs.some((dir) => filePath.includes(dir))
      ) {
        console.log(`Skipping file or directory: ${filePath}`);
        return null;
      }

      const fileData = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      // Handle the directory listing
      if (Array.isArray(fileData.data)) {
        const directoryContents = [];
        for (const item of fileData.data) {
          if (
            skippedExtensions.some((ext) => item.path.endsWith(ext)) ||
            skippedDirs.some((dir) => item.path.includes(dir))
          ) {
            console.log(`Skipping: ${item.path}`);
            continue;
          }

          if (item.type === "file") {
            console.log(`File: ${item.path}`);
            const content = await this.getFileContent(
              owner,
              repoName,
              item.path
            );
            if (content) {
              directoryContents.push({ filePath: item.path, content });
            } else {
              console.log(`No content for file: ${item.path}`);
            }
          } else if (item.type === "dir") {
            console.log(`Directory: ${item.path}`);
            const dirContents = await this.getFileContent(
              owner,
              repoName,
              item.path
            );
            if (dirContents && dirContents.length > 0) {
              directoryContents.push(...dirContents);
            }
          }
        }
        // Log and return directory contents
        console.log(`Directory contents: ${JSON.stringify(directoryContents)}`);
        return directoryContents;
      } else if (fileData.data.type === "file") {
        if (fileData.data.content) {
          const content = Buffer.from(fileData.data.content, "base64").toString(
            "utf8"
          );
          console.log(`Content of file ${filePath}:`, content);
          return content;
        } else {
          console.log(`Warning: No content available for ${filePath}`);
          return null;
        }
      }
    } catch (error) {
      // Catch and log any errors
      console.error(`Error fetching content from ${filePath}:`, error);
      return null;
    }
  }

  async checkRateLimit(token) {
    try {
      const response = await axios.get("https://api.github.com/rate_limit", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      console.log("Rate limit:", response.data.rate.limit);
      console.log("Remaining requests:", response.data.rate.remaining);
    } catch (error) {
      console.error("Error checking rate limit:", error);
    }
  }
}
