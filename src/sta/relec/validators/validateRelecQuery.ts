import type { CliOptions } from '../../../cli/types/CliOptions'
import type { RelecQuery } from '../types/RelecQuery'
import { readRelecOptions } from './readRelecOptions'

/**
 * Check the options before any request: a reference (AÑO/NUMERO of an
 * expediente, or a registry number such as ENT2026039187), at least one
 * PDF, and exactly one type code and one non-empty description per document.
 */
export const validateRelecQuery = (options: CliOptions): RelecQuery => {
  const query = readRelecOptions(options)
  const count = query.documents.length
  const problems = [
    /^(?:\d{4}\/\w+|[A-Z]{3}\d{6,})$/.test(query.reference)
      ? ''
      : '--referencia must be an expediente (AÑO/NUMERO, e.g. 2026/00032519N) or a registry number (e.g. ENT2026039187)',
    count === 0
      ? '--documentos is required: one or more PDFs, comma-separated'
      : '',
    query.typeCodes.length === count
      ? ''
      : '--tipos needs one code per document (DECL, ALTER, CERTI, OTROE...)',
    query.descriptions.length === count && query.descriptions.every(Boolean)
      ? ''
      : "--descripciones needs one non-empty description per document, 'd1|d2|...'",
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return query
}
