import { errorHandler } from "../middleware/errorHandler.js";
import {
  githubService,
  markdownService,
  pdfGenerator,
  aiService,
} from "../services/index.js";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const generateDocumentation = async (req, res, next) => {
  const { repoUrl } = req.body;

  try {
    const { owner, repoName } = await githubService.extractRepoInfo(repoUrl);

    const repoData = await githubService.getRepoData(owner, repoName);

    if (!repoData) {
      return next(errorHandler(404, "Repository not found"));
    }

    // const rateLimit = await githubService.checkRateLimit(
    //   process.env.GITHUB_TOKEN
    // );
    // console.log(rateLimit)

    const repoContent = await githubService.getFileContent(owner, repoName, "");
    console.log("repoContent", repoContent);

    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );

    let fullDocumentation = "";
    for (const content of repoContent) {
      try {
        console.log("Processing:", content.filePath || "unnamed file");
        const aiDocumentation = await aiService.generateDocumentation(
          content.content
        );
        console.log("Documentation generated successfully");
        fullDocumentation += aiDocumentation + "\n";

        await delay(1000);
      } catch (error) {
        if (error.status === 429) {
          console.log("Rate limit hit, waiting for longer period...");
          await delay(5000);

          const aiDocumentation = await aiService.generateDocumentation(
            content.content
          );
          fullDocumentation += aiDocumentation + "\n";
        } else {
          console.error(`Error processing file: ${error}`);
        }
      }
    }

    console.log("fullDocumentation", fullDocumentation);

    // Convert repo (Markdown) to HTML
    //const repoHtml = await markdownService.convertMarkdownToHTML(fullDocumentation);

    // Generate PDF
    const pdf = await pdfGenerator.generatePDF(fullDocumentation);

    // Return the PDF or HTML as response
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export { generateDocumentation };
