import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { SignedParts } from '../types/SignedParts'

/**
 * The last signature of a signed PDF: its byte ranges' content and its CMS,
 * cut at the DER length rather than by trimming zeros, since a signature can
 * end in a zero byte.
 */
export const extractSignedParts = (pdf: Buffer): SignedParts => {
  const text = pdf.toString('latin1')
  const at = text.lastIndexOf('/ByteRange [')
  const byteRange = text
    .slice(at + 12, text.indexOf(']', at))
    .trim()
    .split(/\s+/)
    .map(Number)
  const [start = 0, first = 0, second = 0, length = 0] = byteRange
  const content = Buffer.concat([
    pdf.subarray(start, start + first),
    pdf.subarray(second, second + length),
  ])
  const contents = Buffer.from(text.slice(first + 1, second - 1), 'hex')
  const cms = contents.subarray(0, readDerElement(contents, 0).end)
  return { content, cms, byteRange }
}
