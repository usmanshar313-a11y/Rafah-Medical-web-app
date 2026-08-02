const replacePDFSpecialChars = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const getUtf8ByteLength = (text: string) => new TextEncoder().encode(text).length;

const buildPDF = (lines: string[]) => {
  const pageWidth = 595;
  const pageHeight = 842;
  const marginLeft = 40;
  const marginTop = 40;
  const lineHeight = 16;
  const maxLinesPerPage = Math.floor((pageHeight - marginTop * 2) / lineHeight);
  const textLines: string[][] = [];

  const wrapLine = (line: string) => {
    const wrapperLimit = 90;
    const wrapped: string[] = [];
    let rest = line;
    while (rest.length > wrapperLimit) {
      const splitAt = rest.lastIndexOf(' ', wrapperLimit) || wrapperLimit;
      wrapped.push(rest.slice(0, splitAt));
      rest = rest.slice(splitAt).trimStart();
    }
    wrapped.push(rest);
    return wrapped;
  };

  lines.forEach((line) => {
    wrapLine(line).forEach((piece) => textLines.push([piece]));
  });

  const pages: string[][] = [];
  for (let i = 0; i < textLines.length; i += maxLinesPerPage) {
    pages.push(textLines.slice(i, i + maxLinesPerPage).map((item) => item[0]));
  }

  const objects: string[] = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  const pagesKids = pages
    .map((_, index) => `${3 + index} 0 R`)
    .join(' ');

  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pagesKids}] /Count ${pages.length} >>\nendobj\n`);

  const contentStartIndex = 3 + pages.length;
  const fontIndex = contentStartIndex;

  pages.forEach((pageLines, pageIndex) => {
    objects.push(
      `${3 + pageIndex} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontIndex} 0 R >> >> /Contents ${contentStartIndex + pageIndex} 0 R >>\nendobj\n`
    );
  });

  objects.push(
    `${fontIndex} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  );

  pages.forEach((pageLines, pageIndex) => {
    const yStart = pageHeight - marginTop;
    const contentLines = pageLines.map((line, lineIndex) => {
      const escaped = replacePDFSpecialChars(line);
      if (lineIndex === 0) {
        return `BT /F1 12 Tf ${marginLeft} ${yStart} Td (${escaped}) Tj`;
      }
      return `T* (${escaped}) Tj`;
    });
    const contentStream = `${contentLines.join('\n')}\nET\n`;
    objects.push(
      `${contentStartIndex + pageIndex} 0 obj\n<< /Length ${getUtf8ByteLength(contentStream)} >>\nstream\n${contentStream}endstream\nendobj\n`
    );
  });

  let pdf = '%PDF-1.3\n';
  const offsets: number[] = [0];
  const encoder = new TextEncoder();

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 0; i < objects.length; i += 1) {
    pdf += `${offsets[i + 1].toString().padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return encoder.encode(pdf);
};

export const downloadTextAsPdf = (filename: string, textLines: string[]) => {
  const pdfData = buildPDF(textLines);
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};