import { errorHandler } from "../middleware/errorHandler.js";
import {
  githubService,
  markdownService,
  pdfGenerator,
  aiService,
} from "../services/index.js";
import { Repository, Documentation, GenerateRequest } from "../models/index.js";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createRepo = async (req, res) => {
  try {
    const { userId, repoName, repoUrl } = req.body;
    const repo = await Repository.create({ userId, repoName, repoUrl });

    return res.status(201).json(repo);
  } catch (error) {
    errorHandler(error, res);
  }
};

const generateDocumentation = async (req, res, next) => {
  let repository, documentation;

  try {
    await GenerateRequest.findByIdAndUpdate(process.env.GENERATE_ID, {
      $inc: { count: 1 },
    });

    // let userId = req.user.id;
    const { repoUrl } = req.body;
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

    // repository = await Repository.create({
    //   userId,
    //   repoName,
    //   repoUrl,
    // });

    // documentation = await Documentation.create({
    //   repoId: repository._id,
    //   content: fullDocumentation
    // })

    // Convert repo (Markdown) to HTML
    //const repoHtml = await markdownService.convertMarkdownToHTML(fullDocumentation);

    // Generate PDF
    const pdf = await pdfGenerator.generatePDF(fullDocumentation);

    // Return the PDF or HTML as response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=documentation.pdf");
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export { createRepo, generateDocumentation };