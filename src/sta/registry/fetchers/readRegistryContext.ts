import type { HttpClient } from '../../../http/types/HttpClient'
import { openStaSession } from '../../session/openStaSession'
import { staOrigins } from '../../session/staOrigins'
import type { StaPortal } from '../../types/StaPortal'
import type { RegistryContext } from '../types/RegistryContext'
import type { RegistryMeAnswer } from '../types/RegistryMeAnswer'
import type { RegistrySchema } from '../types/RegistrySchema'
import { getRegistryJson } from './getRegistryJson'
import { openRegistryDraft } from './openRegistryDraft'

/** The read-only half of a registry filing: certificate login, a fresh draft reference of the procedure, the holder and the procedure schema. */
export const readRegistryContext = async (
  client: HttpClient,
  portal: StaPortal,
  procedureId: string,
): Promise<RegistryContext> => {
  const origin = staOrigins[portal]
  await openStaSession(client, origin)
  const session = await openRegistryDraft(client, origin, procedureId)
  const me = await getRegistryJson<RegistryMeAnswer>(
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
