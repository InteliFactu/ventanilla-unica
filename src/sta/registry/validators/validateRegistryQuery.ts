import type { CliOptions } from '../../../cli/types/CliOptions'
import type { StaRegistryQuery } from '../types/StaRegistryQuery'
import { readRegistryOptions } from './readRegistryOptions'

/** Check the options before any request: a DIR3 code, a phone, a subject and at least one PDF. */
export const validateRegistryQuery = (
  options: CliOptions,
): StaRegistryQuery => {
  const query = readRegistryOptions(options)
  const problems = [
    /^(?:[AEGIJLOU]\d{8}|[A-Z]{2}\d{7})$/.test(query.destination)
      ? ''
      : '--destino must be the DIR3 code of the addressee unit, e.g. A11030071',
    /^\+?\d{9,15}$/.test(query.phone)
      ? ''
      : '--telefono must be a phone number',
    query.subject === ''
      ? '--asunto is required (the EXPONE/SOLICITA line)'
      : '',
    query.documents.length === 0
      ? '--documentos is required: one or more PDFs, comma-separated'
      : '',
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return query
}
