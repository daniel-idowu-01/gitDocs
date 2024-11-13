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

    // const rateLimit = await githubService.checkRateLimit(
    //   process.env.GITHUB_TOKEN
    // );
    // console.log(rateLimit)

    const repoContent = await githubService.getFileContent(
      owner,
      repoName,
      ""
    );

    console.log(repoContent, 'repoContent')

    // Convert repo (Markdown) to HTML
    const repoHtml = await markdownService.convertMarkdownToHTML(repoContent);

    // Generate PDF
    const pdf = await pdfGenerator.generatePDF(repoHtml);

    // Return the PDF or HTML as response
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export { generateDocumentation };
