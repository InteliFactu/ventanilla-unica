import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { openVisor } from '../session/openVisor'
import { fetchDocumentTree } from './fetchers/fetchDocumentTree'
import { flattenDocumentTree } from './mappers/flattenDocumentTree'
import { saveJusticiaDocuments } from './saveJusticiaDocuments'
import type { JusticiaDocumentsQuery } from './types/JusticiaDocumentsQuery'
import type { JusticiaDocumentsResult } from './types/JusticiaDocumentsResult'

/** The documents of one expediente from the Atenea IRIS visor, saved under `outDir` when given. Read-only. */
export const listJusticiaDocuments = async (
  client: HttpClient,
  query: JusticiaDocumentsQuery,
): Promise<JusticiaDocumentsResult> => {
  await loginWithCertificate(client)
  const session = await openVisor(client, query.index)
  const documents = flattenDocumentTree(
    await fetchDocumentTree(client, session),
  )
  return {
    procedimiento: session.procedimiento,
    documentos:
      query.outDir === undefined
        ? documents
        : await saveJusticiaDocuments(client, session, documents, query.outDir),
    notes: [
      'each download is logged by the visor as a consultation; it accepts no notification',
    ],
  }
}
