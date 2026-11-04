import type { CliOptions } from '../../../cli/types/CliOptions'
import type { RelecTramiteQuery } from '../types/RelecTramiteQuery'
import { readRelecTramiteOptions } from './readRelecTramiteOptions'

/** Reject malformed arguments before opening a session or reading PDFs. */
export const validateRelecTramiteQuery = (
  options: CliOptions,
): RelecTramiteQuery => {
  const query = readRelecTramiteOptions(options)
  const problems = [
    /^\d{22}$/.test(query.dboid)
      ? ''
      : '--dboid must be a 22-digit procedure id',
    query.subject.length > 0 && query.subject.length <= 2500
      ? ''
      : '--asunto must contain 1 to 2500 characters',
    query.documents.length > 0 ? '' : '--documentos requires at least one PDF',
    query.rows.length === query.documents.length &&
    query.rows.every(Boolean) &&
    new Set(query.rows).size === query.rows.length
      ? ''
      : '--slots requires one distinct, non-empty slot per PDF, comma-separated',
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return query
}
