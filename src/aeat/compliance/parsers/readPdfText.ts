import { inflateStream } from './inflateStream'
import { readShownStrings } from './readShownStrings'

/**
 * The text an AEAT-generated PDF shows, runs joined by one space and
 * whitespace collapsed. Good enough to read a sentence out of a
 * certificate; not a general PDF text extractor (no font maps, no layout).
 */
export const readPdfText = (pdf: Buffer): string => {
  const raw = pdf.toString('latin1')
  const runs: string[] = []
  for (const match of raw.matchAll(/stream\r?\n/g)) {
    const start = match.index + match[0].length
    const end = raw.indexOf('endstream', start)
    if (end === -1) break
    const inflated = inflateStream(pdf.subarray(start, end))
    if (inflated !== undefined)
      runs.push(...readShownStrings(inflated.toString('latin1')))
  }
  return runs.join(' ').replaceAll(/\s+/g, ' ').trim()
}
