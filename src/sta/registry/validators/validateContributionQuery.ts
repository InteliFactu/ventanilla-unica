import type { CliOptions } from '../../../cli/types/CliOptions'
import type { StaContributionQuery } from '../types/StaContributionQuery'
import { parseDocumentList } from './parseDocumentList'

/**
 * Check the options before any request: an AÑO/NUMERO expediente, at least
 * one PDF and no more `|`-separated descriptions than documents.
 */
export const validateContributionQuery = (
  options: CliOptions,
): StaContributionQuery => {
  const expediente = (options['expediente'] ?? '').trim().toUpperCase()
  const documents = parseDocumentList(options['documentos'])
  const descriptions = (options['descripciones'] ?? '')
    .split('|')
    .map((text) => text.trim())
    .filter(Boolean)
  const comment = options['informacion']?.trim() || undefined
  const problems = [
    /^\d{4}\/\w+$/.test(expediente)
      ? ''
      : '--expediente must be the AÑO/NUMERO of an open file, e.g. 2026/25777D',
    documents.length === 0
      ? '--documentos is required: one or more PDFs, comma-separated'
      : '',
    descriptions.length > documents.length
      ? '--descripciones has more entries than --documentos'
      : '',
  ].filter(Boolean)
  if (problems.length > 0) throw new Error(problems.join('; '))
  return { expediente, documents, descriptions, comment }
}
