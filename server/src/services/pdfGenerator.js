import PDFDocument from 'pdfkit';

export default class PdfGenerator {
  constructor() {}

  async generatePDF(fullDocumentation) {
    try {
      const doc = new PDFDocument();
      const chunks = [];
  
      // Collect the PDF data chunks
      doc.on('data', chunk => chunks.push(chunk));
      
      // Return a Promise that resolves with the complete PDF buffer
      return new Promise((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });
        
        doc.on('error', reject);
  
        // Add title
        doc.fontSize(20)
           .text('Project Documentation', {
             align: 'center'
           })
           .moveDown(2);
        
        // Add content with some formatting
        doc.fontSize(12)
           .text(fullDocumentation, {
             align: 'left',
             lineGap: 5
           });
        
        // Finalize the PDF
        doc.end();
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
  
}
