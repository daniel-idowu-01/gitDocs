import GithubService from "./githubService.js";
import MarkdownService from "./markdownService.js";
import PdfGenerator from "./pdfGenerator.js";
import AIService from "./aiService.js";

const githubService = new GithubService();
const markdownService = new MarkdownService();
const pdfGenerator = new PdfGenerator();
const aiService = new AIService();

export { githubService, markdownService, pdfGenerator, aiService };
