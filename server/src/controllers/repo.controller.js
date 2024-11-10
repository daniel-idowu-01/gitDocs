import { errorHandler } from "../middleware/errorHandler.js";
import {
  githubService,
  markdownService,
  pdfGenerator,
} from "../services/index.js";

const generateDocumentation = async (req, res, next) => {
  const { repoUrl } = req.body;

  try {
    const { owner, repoName } = await githubService.extractRepoInfo(repoUrl);

    const repoData = await githubService.getRepoData(owner, repoName);

    if (!repoData) {
      return next(errorHandler(404, "Repository not found"));
    }

    const readmeContent = await githubService.getFileContent(
      owner,
      repoName,
      "client/README.md"
    );

    // Convert README (Markdown) to HTML
    const readmeHtml = await markdownService.convertMarkdownToHTML(readmeContent);

    // Generate PDF
    const pdf = await pdfGenerator.generatePDF(readmeHtml);

    // Return the PDF or HTML as response
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export { generateDocumentation };
