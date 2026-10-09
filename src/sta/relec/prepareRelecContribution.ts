import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import { fetchDocumentTypes } from './fetchers/fetchDocumentTypes'
import { openRelecForm } from './fetchers/openRelecForm'
import { mapRelecDocuments } from './mappers/mapRelecDocuments'
import { mapRelecPlan } from './mappers/mapRelecPlan'
import { parseRelecForm } from './parsers/parseRelecForm'
import type { RelecPreparation } from './types/RelecPreparation'
import type { RelecQuery } from './types/RelecQuery'
import { assertPdfSignable } from './validators/assertPdfSignable'
import { assertRelecFiles } from './validators/assertRelecFiles'

/**
 * The read-only half of `caceres aportar`: the files checked (PDF, size,
 * hash, a throw-away local PAdES signature), the certificate login, the
 * Relec form opened, the document types resolved and the plan. Nothing is
 * uploaded or registered.
 */
export const prepareRelecContribution = async (
  client: HttpClient,
  query: RelecQuery,
  identity: CertificateIdentity,
): Promise<RelecPreparation> => {
  const files = await assertRelecFiles(query.documents)
  for (const file of files) await assertPdfSignable(identity, file.path)
  const origin = staOrigins.caceres
  await openStaSession(client, origin)
  const page = await openRelecForm(client, origin)
  const form = parseRelecForm(page.text, page.url)
  const types = await fetchDocumentTypes(client, origin)
  const documents = mapRelecDocuments(files, query, types)
  const plan = mapRelecPlan(new URL(origin).hostname, query, form, documents)
  return { origin, formUrl: page.url, form, types, plan }
}
