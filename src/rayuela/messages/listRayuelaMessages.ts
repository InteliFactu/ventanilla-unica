import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPageResponse } from '../session/fetchers/fetchRayuelaPageResponse'
import { resolveRayuelaResponseDay } from './dates/resolveRayuelaResponseDay'
import { filterRayuelaMessagesSince } from './mappers/filterRayuelaMessagesSince'
import { parseRayuelaMessages } from './parsers/parseRayuelaMessages'
import { parseRayuelaSinceId } from './parsers/parseRayuelaSinceId'
import type { RayuelaMessages } from './types/RayuelaMessages'
import type { RayuelaTray } from './types/RayuelaTray'
/** Read the first page of the selected tray (inbox by default), optionally filtering by id. */
export const listRayuelaMessages = async (
  client: HttpClient,
  tray: RayuelaTray = 'REC',
  sinceId?: string,
): Promise<RayuelaMessages> => {
  const threshold = parseRayuelaSinceId(sinceId)
  const requestedAt = new Date()
  const page = await fetchRayuelaPageResponse(
    client,
    'RegMisMenPla',
    undefined,
    {
      BANDEJA: tray,
    },
  )
  const day = resolveRayuelaResponseDay(
    page.headers['date'],
    requestedAt,
    new Date(),
  )
  return filterRayuelaMessagesSince(
    parseRayuelaMessages(page.text, day),
    threshold,
  )
}
