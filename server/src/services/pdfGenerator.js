import PDFDocument from 'pdfkit';
import fs from 'fs';

export default class PdfGenerator {
  constructor() {}

  async generatePDF(fullDocumentation) {
    try {
      const doc = new PDFDocument();
      
      doc.pipe(fs.createWriteStream('documentation.pdf'));
      
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
      
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  
}
