import type { HttpClient } from '../../http/types/HttpClient'
import type { VisorSession } from '../session/types/VisorSession'
import { fetchVisorDocument } from './fetchers/fetchVisorDocument'
import type { JusticiaDocument } from './types/JusticiaDocument'
import type { VisorFile } from './types/VisorFile'
import { writeJusticiaDocument } from './writers/writeJusticiaDocument'

/**
 * Download one document into `outDir`. A visor refusal or a failed download
 * comes back as the document's `error`, so the caller can go on with the rest;
 * a local write failure still throws, since every later write would fail too.
 */
export const saveJusticiaDocument = async (
  client: HttpClient,
  session: VisorSession,
  document: JusticiaDocument,
  outDir: string,
): Promise<JusticiaDocument> => {
  let file: VisorFile
  try {
    file = await fetchVisorDocument(client, session, document)
  } catch (error) {
    return {
      ...document,
      error: error instanceof Error ? error.message : String(error),
    }
  }
  const path = await writeJusticiaDocument(
    outDir,
    session.procedimiento,
    document.numero,
    file,
  )
  return { ...document, path, bytes: file.bytes.length }
}
