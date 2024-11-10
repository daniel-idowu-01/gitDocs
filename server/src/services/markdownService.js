import { marked } from "marked";

export default class MarkdownService {
  constructor() {}

  async convertMarkdownToHTML(markdownContent) {
    return marked(markdownContent);
  }
}
