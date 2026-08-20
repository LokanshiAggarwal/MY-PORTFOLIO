/* eslint-disable no-console */
/**
 * Generates a minimal, valid placeholder PDF for the "Download Resume" button.
 * Replace public/resume.pdf with the real resume later.
 */
const fs = require('fs');
const path = require('path');

function buildPdf() {
  const offsets = [0];
  let content = '%PDF-1.4\n';

  const addObject = (n, body) => {
    offsets[n] = Buffer.byteLength(content, 'utf8');
    content += `${n} 0 obj\n${body}\nendobj\n`;
  };

  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');

  const stream =
    'BT /F1 24 Tf 72 740 Td (Lokanshi - Resume) Tj ET\n' +
    'BT /F1 12 Tf 72 712 Td (Placeholder resume - replace with the real document.) Tj ET\n' +
    'BT /F1 10 Tf 72 688 Td (UI/UX Designer - Frontend Developer - Creative Problem Solver) Tj ET\n';

  addObject(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>');
  addObject(4, `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}endstream`);
  addObject(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const xrefStart = Buffer.byteLength(content, 'utf8');
  content += 'xref\n0 6\n';
  content += '0000000000 65535 f \n';
  for (let i = 1; i <= 5; i += 1) {
    content += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  content += 'trailer\n<< /Size 6 /Root 1 0 R >>\n';
  content += `startxref\n${xrefStart}\n%%EOF\n`;

  return content;
}

const out = path.resolve(__dirname, '../public/resume.pdf');
fs.writeFileSync(out, buildPdf(), 'utf8');
console.log('Wrote', out, Buffer.byteLength(buildPdf(), 'utf8'), 'bytes');

