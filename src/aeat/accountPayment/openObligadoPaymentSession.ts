import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { fetchAccountPaymentForm } from './fetchers/fetchAccountPaymentForm'
import { parseCertificateHolder } from './parsers/parseCertificateHolder'

/** Bind the separate read-only MisPagos session to the NIF in the payment request. */
export const openObligadoPaymentSession = async (
  client: HttpClient,
  nif: string,
): Promise<HttpClient> => {
  await openAeatSession(client)
  const holder = parseCertificateHolder(await fetchAccountPaymentForm(client))
  if (holder?.nif !== nif)
    throw new Error(
      'AEAT: the second certificate holder does not match the obligado; debit blocked',
    )
  return client
}
