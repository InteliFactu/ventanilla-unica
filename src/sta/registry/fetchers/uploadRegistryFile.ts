import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import type { HttpClient } from '../../../http/types/HttpClient'
import { buildMultipartBody } from '../builders/buildMultipartBody'
import { registryApiPath } from '../registryApiPath'
import type { RegistrySession } from '../types/RegistrySession'
import type { RegistrySlot } from '../types/RegistrySlot'
import type { RegistryUpload } from '../types/RegistryUpload'
import { registryHeaders } from './registryHeaders'

/**
 * Store one PDF in the draft: `POST /requests/<procedure>/documents/<type>/files`
 * with the parts `name`, `content` and `reference`, as the SPA's FormData sends
 * them. The answer carries the SHA-256 the request body must list.
 */
export const uploadRegistryFile = async (
  client: HttpClient,
  session: RegistrySession,
  slot: RegistrySlot,
  path: string,
): Promise<RegistryUpload> => {
  const name = basename(path)
  // path is the holder's own --documentos choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const bytes = await readFile(path)
  const { body, contentType } = buildMultipartBody(
    { name, reference: session.reference },
    { field: 'content', name, type: 'application/pdf', bytes },
  )
  const { origin, procedureId } = session
  const response = await client.request(
    `${origin}${registryApiPath}/requests/${procedureId}/documents/${slot.documentId}/files`,
    {
      method: 'POST',
      body,
      headers: {
        ...registryHeaders(client, origin),
        'Content-Type': contentType,
      },
      timeoutMs: 300_000,
    },
  )
  if (response.status !== 200)
    throw new Error(`upload of ${name} answered ${String(response.status)}`)
  return JSON.parse(response.text) as RegistryUpload
}
