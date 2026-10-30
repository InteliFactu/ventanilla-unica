import type { HttpClient } from '../../http/types/HttpClient'
import type { VisorSession } from '../session/types/VisorSession'
import { saveJusticiaDocument } from './saveJusticiaDocument'
import type { JusticiaDocument } from './types/JusticiaDocument'

/**
 * Download every accessible document, one at a time, into `outDir`. Every
 * document comes back: inaccessible ones unchanged, refused ones with `error`.
 */
export const saveJusticiaDocuments = async (
  client: HttpClient,
  session: VisorSession,
  documents: readonly JusticiaDocument[],
  outDir: string,
): Promise<readonly JusticiaDocument[]> => {
  const saved: JusticiaDocument[] = []
  for (const document of documents) {
    saved.push(
      document.accesible
        ? await saveJusticiaDocument(client, session, document, outDir)
        : document,
    )
  }
  return saved
}
