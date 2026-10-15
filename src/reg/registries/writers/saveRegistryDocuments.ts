import { basename } from 'node:path'

import { writeFilingFile } from '../../../aeat/documentFiling/writers/writeFilingFile'
import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchRegistryDocument } from '../fetchers/fetchRegistryDocument'
import type { RegistryDocument } from '../types/RegistryDocument'

/** Download every document of an entry into `outDir` as `<uuid>-<base name>` and return the paths. */
export const saveRegistryDocuments = async (
  client: HttpClient,
  token: string,
  documents: readonly RegistryDocument[],
  outDir: string,
): Promise<string[]> => {
  const saved: string[] = []
  for (const document of documents) {
    const bytes = await fetchRegistryDocument(client, token, document.uuid)
    const name = `${document.uuid}-${basename(document.name)}`
    saved.push(await writeFilingFile(outDir, name, bytes))
  }
  return saved
}
