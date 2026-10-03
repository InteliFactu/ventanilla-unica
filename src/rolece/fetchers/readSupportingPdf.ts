import { basename } from 'node:path'

import { readContentFile } from '../../signing/xades/fetchers/readContentFile'
import type { SubmittedDocument } from '../../tgss/attachments/types/SubmittedDocument'

/**
 * Read one supporting document named on the command line and refuse anything
 * that is not a PDF. ROLECE only accepts electronic originals (a notary's or
 * registrar's signed copy, or one carrying a CSV); the signature inside is
 * the issuer's business and is not checked here.
 */
export const readSupportingPdf = async (
  option: string,
  path: string,
): Promise<SubmittedDocument> => {
  const content = await readContentFile(path)
  if (!content.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error(`--${option} is not a PDF: ${basename(path)}`)
  return { path, fileName: basename(path), bytes: content.length }
}
