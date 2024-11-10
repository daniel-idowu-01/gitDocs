import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default class PdfGenerator {
  constructor() {}

  async generatePDF(docContent) {
    const doc = new jsPDF();
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    doc.text(docContent, 10, 10);
    // doc.save("documentation.pdf"); // client side

    // Save PDF to a specific location on the server's filesystem
    const filePath = path.join(__dirname, "document.pdf");
    const pdfOutput = doc.output();

    fs.writeFileSync(filePath, pdfOutput); 
  }
}
