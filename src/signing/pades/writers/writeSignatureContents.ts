import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'

/** Write the CMS, hex, into the /Contents placeholder, refusing one that does not fit. */
export const writeSignatureContents = (
  prepared: PreparedPdfSignature,
  cms: Buffer,
): Buffer => {
  const hex = cms.toString('hex').toUpperCase()
  if (hex.length > prepared.contentsEnd - prepared.contentsAt - 2)
    throw new Error('CMS larger than the /Contents placeholder')
  const out = Buffer.from(prepared.file)
  out.write(hex, prepared.contentsAt + 1, 'latin1')
  return out
}
