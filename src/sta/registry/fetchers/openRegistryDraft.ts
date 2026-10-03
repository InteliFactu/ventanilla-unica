import type { HttpClient } from '../../../http/types/HttpClient'
import type { RegistrySession } from '../types/RegistrySession'

/**
 * Open a fresh draft of the procedure. The SPA entry redirects to
 * `/sta/reg/tramite/<procedure>/<reference>/credentials`; the UUID in that URL
 * is the draft every later call names. Earlier unfinished drafts are left
 * alone: a new reference is issued each time.
 */
export const openRegistryDraft = async (
  client: HttpClient,
  origin: string,
  procedureId: string,
): Promise<RegistrySession> => {
  const response = await client.request(
    `${origin}/sta/reg/auth/es/${procedureId}`,
  )
  const segments = new URL(response.url).pathname.split('/')
  const reference = segments[segments.indexOf(procedureId) + 1] ?? ''
  if (!/^[0-9a-f-]{36}$/.test(reference))
    throw new Error(
      `${new URL(origin).hostname}: the registry did not open a draft (${response.url})`,
    )
  return { origin, procedureId, reference }
}
