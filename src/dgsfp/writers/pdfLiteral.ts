/**
 * A PDF literal string for a WinAnsi-encoded standard font: Latin-1 bytes
 * (WinAnsi agrees with Latin-1 above 0xA0, which covers Spanish), anything
 * else as "?", and the delimiters escaped.
 */
export const pdfLiteral = (text: string): string => {
  const latin1Max = 0xff
  let safe = ''
  for (const char of text)
    safe += (char.codePointAt(0) ?? 0) > latin1Max ? '?' : char
  return `(${safe.replaceAll(/[\\()]/g, (char) => `\\${char}`)})`
}
