import type { CliOptions } from '../../../cli/types/CliOptions'
import type { RelecInstanceQuery } from '../types/RelecInstanceQuery'
import { readRelecInstanceOptions } from './readRelecInstanceOptions'

/**
 * Check the `caceres instancia` options before any request: a non-empty
 * asunto, at least one PDF, and exactly one non-empty row per document.
 */
export const validateRelecInstanceQuery = (
  options: CliOptions,
): RelecInstanceQuery => {
  const query = readRelecInstanceOptions(options)
  const count = query.documents.length
  const problems = [
    query.subject === '' ? '--asunto is required' : '',
    count === 0
      ? '--documentos is required: one or more PDFs, comma-separated (the sede requires "Instancia General Mod-201")'
      : '',
    query.rows.length === count && query.rows.every(Boolean)
      ? ''
      : "--filas needs one form row per document, by name or DocReq id, 'Instancia General|Otros documentos de entrada'",
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return query
}
