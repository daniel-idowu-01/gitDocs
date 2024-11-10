import {jsPDF} from "jspdf";

export default class PdfGenerator {
  constructor() {}

  async generatePDF(docContent) {
    const doc = new jsPDF();
    doc.text(docContent, 10, 10);
    doc.save("documentation.pdf");
  }
}
