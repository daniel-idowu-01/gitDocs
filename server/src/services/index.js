import GithubService from "./githubService.js";
import MarkdownService from "./markdownService.js";
import PdfGenerator from "./pdfGenerator.js";
import AIService from "./aiService.js";
import AdminService from "./adminService.js";

const githubService = new GithubService();
const markdownService = new MarkdownService();
const pdfGenerator = new PdfGenerator();
const aiService = new AIService();
const adminService = new AdminService();

export { githubService, markdownService, pdfGenerator, aiService, adminService };