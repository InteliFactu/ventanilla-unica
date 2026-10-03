import { decodePdfHexString } from './decodePdfHexString'
import { decodePdfLiteral } from './decodePdfLiteral'

/**
 * Every string a content stream shows with `Tj`, in order. The AEAT's
 * MotorPDF writes one `Tj` per run, hex (`<...>`) when the run carries a
 * non-ASCII letter and literal (`(...)`) otherwise; it never uses `TJ`.
 */
export const readShownStrings = (content: string): string[] =>
  [
    ...content.matchAll(
      /<([\dA-Fa-f\s]*)>\s*Tj|\(((?:\\[\s\S]|[^\\)])*)\)\s*Tj/g,
    ),
  ].map(([, hex, literal]) =>
    hex === undefined
      ? decodePdfLiteral(literal ?? '')
      : decodePdfHexString(hex),
  )
