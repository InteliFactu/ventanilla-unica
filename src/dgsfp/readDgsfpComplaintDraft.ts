import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { HttpClient } from '../http/types/HttpClient'
import { fetchDgsfpDirectRead } from './fetchers/fetchDgsfpDirectRead'
import { fetchDgsfpProcedureAnswer } from './fetchers/fetchDgsfpProcedureAnswer'
import { parseDgsfpDraftPresence } from './parsers/parseDgsfpDraftPresence'
import { openDgsfpSession } from './session/openDgsfpSession'
import { assertDgsfpCertificateHolder } from './validators/assertDgsfpCertificateHolder'

/** Check whether the certificate holder has an existing complaint draft. */
export const readDgsfpComplaintDraft = async (
  client: HttpClient,
  identity: CertificateIdentity,
): Promise<boolean> => {
  const { digest, holder } = await openDgsfpSession(client)
  assertDgsfpCertificateHolder(identity, holder)
  const procedure = await fetchDgsfpProcedureAnswer(client, digest, true)
  if (procedure.numTelematico !== 'TEL43') {
    throw new Error('DGSFP: expected the TEL43 complaint procedure')
  }
  const body = await fetchDgsfpDirectRead(
    client,
    digest,
    `RestService.svc/recuperarBorradorPresentacion?b=${procedure.numTelematico}`,
  )
  return parseDgsfpDraftPresence(body)
}
