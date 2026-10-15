import type { HttpClient } from '../../../http/types/HttpClient'
import { callRegApi } from '../../session/fetchers/callRegApi'
import type { RegDocumentAnswer } from '../types/RegDocumentAnswer'

/** One document's bytes: the API answers `{name, file}` with the file in base64. */
export const fetchRegistryDocument = async (
  client: HttpClient,
  token: string,
  uuid: string,
): Promise<Buffer> => {
  const answer = (await callRegApi(
    client,
    token,
    `documents/uuid/${encodeURIComponent(uuid)}/storageType/FILESYSTEM`,
  )) as RegDocumentAnswer
  if (!answer.file) throw new Error(`REG: document ${uuid} came back empty`)
  return Buffer.from(answer.file, 'base64')
}
