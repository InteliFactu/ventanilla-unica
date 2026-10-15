import type { HttpClient } from '../../http/types/HttpClient'
import type { VisorSession } from '../session/types/VisorSession'
import { fetchVisorDocument } from './fetchers/fetchVisorDocument'
import type { JusticiaDocument } from './types/JusticiaDocument'
import { writeJusticiaDocument } from './writers/writeJusticiaDocument'

/** Download every accessible document, one at a time, into `outDir`; inaccessible ones are returned unchanged. */
export const saveJusticiaDocuments = async (
  client: HttpClient,
  session: VisorSession,
  documents: readonly JusticiaDocument[],
  outDir: string,
): Promise<readonly JusticiaDocument[]> => {
  const saved: JusticiaDocument[] = []
  for (const document of documents) {
    if (!document.accesible) {
      saved.push(document)
      continue
    }
    const file = await fetchVisorDocument(client, session, document)
    const path = await writeJusticiaDocument(
      outDir,
      session.procedimiento,
      document.numero,
      file,
    )
    saved.push({ ...document, path, bytes: file.bytes.length })
  }
  return saved
}
