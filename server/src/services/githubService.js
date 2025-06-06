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
        ".ico",
        ".css",
      ];
      const skippedFiles = [
        "package-lock.json",
        ".gitignore",
        ".eslintrc.json",
      ];
      const skippedDirs = ["node_modules", "images", "assets", ".git"];

      // Skip if the file path matches any of the skipped extensions or directories
      if (
        skippedExtensions.some((ext) => filePath.endsWith(ext)) ||
        skippedFiles.some((file) => filePath.endsWith(file)) ||
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
            skippedFiles.some((file) => item.path.endsWith(file)) ||
            skippedDirs.some((dir) => item.path.includes(dir))
          ) {
            continue;
          }

          if (item.type === "file") {
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

        return directoryContents;
      } else if (fileData.data.type === "file") {
        if (fileData.data.content) {
          const content = Buffer.from(fileData.data.content, "base64").toString(
            "utf8"
          );
          return content;
        } else {
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
    } catch (error) {
      console.error("Error checking rate limit:", error);
    }
  }

  async getUserGithubRepos(url) {
    try {
      const parts = url.split("https://github.com/");
      const owner = parts[1];
      const response = await fetch(
        `https://api.github.com/users/${owner}/repos`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      const repos = await response.json();
      const repoUrls = repos.map((repo) => repo.html_url);

      return repoUrls;
    } catch (error) {
      console.log("rrr", error);
      return null;
    }
  }

  async getRepoCommits(repoUrl) {
    try {
      let page = 1;
      let hasMoreCommits = true;
      const commits = [];
      const { owner, repoName } = await this.extractRepoInfo(repoUrl);

      while (hasMoreCommits) {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repoName}/commits?per_page=100&page=${page}`,
            {
              headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              },
            }
          );

          commits.push(...response.data);

          if (response.data.length < 100) {
            hasMoreCommits = false;
          } else {
            page += 1;
          }
        } catch (error) {
          if (error.status == 404) {
            return { error: "Repository not found" };
          }
          console.error(
            "Error fetching commits:",
            error.response?.data || error.message
          );
          break;
        }
      }

      return commits;
    } catch (error) {
      console.log("rrr", error);
      return null;
    }
  }
}
