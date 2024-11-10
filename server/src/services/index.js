import GithubService from "./githubService.js";
import MarkdownService from "./markdownService.js";
import PdfGenerator from "./pdfGenerator.js";

const githubService = new GithubService();
const markdownService = new MarkdownService();
const pdfGenerator = new PdfGenerator();

export { githubService, markdownService, pdfGenerator };
