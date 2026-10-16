import type { HttpClient } from '../../http/types/HttpClient'
import { fetchBillingPlace } from './fetchers/fetchBillingPlace'
import { mapIdentificationFields } from './mappers/mapIdentificationFields'
import { readRepresentative } from './parsers/readRepresentative'
import type { NotaQuery } from './types/NotaQuery'
import type { PreparedNota } from './types/PreparedNota'
import { walkToIdentification } from './walkToIdentification'

/**
 * Everything the order needs, read without creating it: the company, the
 * representative the certificate names, the billing place codes and the
 * identification form that would be posted.
 */
export const prepareNota = async (
  client: HttpClient,
  query: NotaQuery,
): Promise<PreparedNota> => {
  const step = await walkToIdentification(client, query)
  const representative = readRepresentative(step.page.text, step.page.url)
  if (!representative)
    throw new Error(
      'registradores: the identification page names no certificate holder',
    )
  const place = await fetchBillingPlace(
    client,
    query.nif,
    query.municipio ?? step.company.registry,
  )
  return {
    csrf: step.csrf,
    company: step.company,
    accountsDepositAvailable: step.accountsDepositAvailable,
    representative,
    place,
    identification: mapIdentificationFields(
      query,
      step.company,
      representative,
      place,
    ),
  }
}
