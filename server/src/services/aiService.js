import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

export default class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is not configured in environment variables"
      );
    }
  }

  async generateDocumentation(repoPrompt) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      Generate comprehensive documentation for this github repo content: ${repoPrompt}. Make your response as short as can be
    `;

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      console.log("errrrrrrrrrr", error);
      throw error;
    }
  }
}
