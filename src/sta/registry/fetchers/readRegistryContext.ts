import type { HttpClient } from '../../../http/types/HttpClient'
import { openStaSession } from '../../session/openStaSession'
import { staOrigins } from '../../session/staOrigins'
import type { StaPortal } from '../../types/StaPortal'
import { generalRegistryProcedures } from '../generalRegistryProcedures'
import type { RegistryPerson } from '../types/RegistryPerson'
import type { RegistrySchema } from '../types/RegistrySchema'
import type { RegistrySession } from '../types/RegistrySession'
import { getRegistryJson } from './getRegistryJson'
import { openRegistryDraft } from './openRegistryDraft'

/** The read-only half, for a sede whose general registry is mapped: certificate login, a fresh draft reference, the holder and the procedure schema. */
export const readRegistryContext = async (
  client: HttpClient,
  portal: StaPortal,
): Promise<{
  readonly origin: string
  readonly session: RegistrySession
  readonly person: RegistryPerson
  readonly schema: RegistrySchema
}> => {
  const procedureId = generalRegistryProcedures[portal]
  if (!procedureId) throw new Error(`${portal}: general registry not mapped`)
  const origin = staOrigins[portal]
  await openStaSession(client, origin)
  const session = await openRegistryDraft(client, origin, procedureId)
  const me = await getRegistryJson<{ readonly person: RegistryPerson }>(
    client,
    origin,
    `/people/me/${session.reference}`,
  )
  const schema = await getRegistryJson<RegistrySchema>(
    client,
    origin,
    `/requests/${procedureId}/${session.reference}`,
  )
  return { origin, session, person: me.person, schema }
}
