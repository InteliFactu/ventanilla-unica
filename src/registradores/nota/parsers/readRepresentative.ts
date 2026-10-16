import { parseForms } from '../../../html/parsers/parseForms'
import type { NotaRepresentative } from '../types/NotaRepresentative'

/**
 * The certificate holder the identification page echoes as hidden
 * `personCertificationData.*` fields; the representative of the order. The
 * page is Vue-driven: its other inputs are templates, not submitted values.
 */
export const readRepresentative = (
  html: string,
  baseUrl: string,
): NotaRepresentative | undefined => {
  const form = parseForms(html, baseUrl).find((candidate) =>
    candidate.action.includes('confirmar-identificacion-invitado'),
  )
  const field = (name: string): string =>
    form?.fields[`personCertificationData.${name}`] ?? ''
  if (field('documentNumber') === '') return undefined
  return {
    documentType: field('documentType') || 'NIF',
    documentNumber: field('documentNumber'),
    name: field('name'),
    primaryLastName: field('primaryLastName'),
    secondLastName: field('secondLastName'),
  }
}
