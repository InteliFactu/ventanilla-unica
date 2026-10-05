/**
 * A classic-xref PDF 1.4 of A4 pages from their content streams, with
 * Helvetica and Helvetica-Bold in WinAnsiEncoding. Objects: 1 catalog,
 * 2 page tree, 3 and 4 fonts, then a page and its content per page.
 */
export const assembleTextPdf = (contents: readonly string[]): Buffer => {
  const font = (name: string): string =>
    `<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`
  const kids = contents.map((_, index) => `${String(5 + index * 2)} 0 R`)
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${String(contents.length)} >>`,
    font('Helvetica'),
    font('Helvetica-Bold'),
    ...contents.flatMap((content, index) => [
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${String(6 + index * 2)} 0 R >>`,
      `<< /Length ${String(Buffer.byteLength(content, 'latin1'))} >>\nstream\n${content}\nendstream`,
    ]),
  ]
  let body = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
  const offsets = objects.map((object, index) => {
    const offset = Buffer.byteLength(body, 'latin1')
    body += `${String(index + 1)} 0 obj\n${object}\nendobj\n`
    return offset
  })
  const xref = Buffer.byteLength(body, 'latin1')
  const rows = offsets.map(
    (offset) => `${String(offset).padStart(10, '0')} 00000 n \n`,
  )
  body += `xref\n0 ${String(objects.length + 1)}\n0000000000 65535 f \n${rows.join('')}`
  body += `trailer\n<< /Size ${String(objects.length + 1)} /Root 1 0 R >>\nstartxref\n${String(xref)}\n%%EOF\n`
  return Buffer.from(body, 'latin1')
}
