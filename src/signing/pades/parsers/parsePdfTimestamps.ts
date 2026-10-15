import type { PdfTimestamps } from '../types/PdfTimestamps'

/** `firmar pdf --tsa url [--sello firma|documento|ambos]`: which timestamps the TSA adds; `firma` by default. */
export const parsePdfTimestamps = (
  tsa: string | undefined,
  kind: string | undefined,
): PdfTimestamps => {
  if (!tsa) {
    if (kind !== undefined) throw new Error('--sello needs --tsa')
    return {}
  }
  const authority = { url: tsa }
  if (kind === undefined || kind === 'firma') return { timestamp: authority }
  if (kind === 'documento') return { documentTimestamp: authority }
  if (kind === 'ambos')
    return { timestamp: authority, documentTimestamp: authority }
  throw new Error(`--sello is firma, documento or ambos, not ${kind}`)
}
