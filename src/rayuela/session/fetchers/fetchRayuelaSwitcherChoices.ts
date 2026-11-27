import type { HttpClient } from '../../../http/types/HttpClient'
import { parseRayuelaChildrenChoices } from '../parsers/parseRayuelaChildrenChoices'
import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'
import type { RayuelaSession } from '../types/RayuelaSession'
import { fetchRayuelaResponse } from './fetchRayuelaResponse'

/** Read the children offered by the session's current navigation bar. */
export const fetchRayuelaSwitcherChoices = async (
  client: HttpClient,
  session: RayuelaSession,
): Promise<RayuelaChildChoice[]> =>
  parseRayuelaChildrenChoices(
    (await fetchRayuelaResponse(client, session.navigation)).text,
  )
