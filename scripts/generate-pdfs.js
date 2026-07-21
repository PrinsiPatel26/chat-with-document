const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'tmp', 'test-pdfs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function makePdf(fileName, text, repeat=1) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(path.join(outDir, fileName));
    doc.pipe(stream);
    for (let i = 0; i < repeat; i++) {
      doc.fontSize(12).text(text, { align: 'left' });
      doc.addPage();
    }
    doc.end();
    stream.on('finish', () => resolve());
  });
}

(async () => {
  console.log('Generating test PDFs in', outDir);
  await makePdf('short.pdf', 'Hello World - short PDF sample');
  await makePdf('medium.pdf', 'This is a medium length PDF.\nLine repeated to make content larger.\n', 10);
  await makePdf('long.pdf', 'Long PDF content. Each page contains sample text repeated many times.\n', 50);
  console.log('PDF generation complete');
})();
