import { pdfLiteralEscapes } from './pdfLiteralEscapes'

/**
 * The body of a `( ... )` PDF literal string with its backslash escapes
 * resolved: named, octal (`\ddd`), line continuations and quoted
 * characters. Bytes are kept as Latin-1 code points; the AEAT certificates
 * use WinAnsiEncoding, which agrees with Latin-1 on every letter they print.
 */
export const decodePdfLiteral = (body: string): string =>
  body.replaceAll(
    /\\([0-7]{1,3}|[\s\S])/g,
    (_match, escaped: string): string => {
      if (/^[0-7]+$/.test(escaped))
        return String.fromCharCode(Number.parseInt(escaped, 8))
      if (escaped === '\n') return ''
      return pdfLiteralEscapes[escaped] ?? escaped
    },
  )
