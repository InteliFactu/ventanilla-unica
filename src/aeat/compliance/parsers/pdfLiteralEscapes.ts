/** The named backslash escapes of a PDF literal string (ISO 32000-1, table 3). */
export const pdfLiteralEscapes: Readonly<Record<string, string>> = {
  n: '\n',
  r: '\r',
  t: '\t',
  b: '\b',
  f: '\f',
}
