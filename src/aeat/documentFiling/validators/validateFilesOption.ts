import type { DocumentFilingQuery } from '../types/DocumentFilingQuery'
import { filingDocumentTypes } from './filingDocumentTypes'

/** `--documentos a.pdf,b.pdf` and `[--tipos 203,200]`, one type code per document (200 when left out). */
export const validateFilesOption = (
  documentos: string | undefined,
  tipos: string | undefined,
): DocumentFilingQuery['files'] => {
  const paths = (documentos ?? '').split(',').filter(Boolean)
  if (paths.length === 0) throw new Error('--documentos is required')
  const types = (tipos ?? '').split(',').filter(Boolean)
  if (types.length > 0 && types.length !== paths.length)
    throw new Error('--tipos needs one type code per document')
  const unknown = types.find((type) => !filingDocumentTypes.has(type))
  if (unknown) throw new Error(`--tipos: unknown document type ${unknown}`)
  return paths.map((path, index) => ({ path, type: types[index] ?? '200' }))
}
