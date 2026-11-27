import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPageResponse } from '../session/fetchers/fetchRayuelaPageResponse'
import { resolveRayuelaResponseDay } from './dates/resolveRayuelaResponseDay'
import { filterRayuelaMessagesSince } from './mappers/filterRayuelaMessagesSince'
import { parseRayuelaMessages } from './parsers/parseRayuelaMessages'
import { parseRayuelaSinceId } from './parsers/parseRayuelaSinceId'
import type { RayuelaMessages } from './types/RayuelaMessages'
import type { RayuelaTray } from './types/RayuelaTray'
import { readRayuelaMessagePageOffset } from './validators/readRayuelaMessagePageOffset'
/** Read one page of the selected tray (the first inbox page by default). */
export const listRayuelaMessages = async (
  client: HttpClient,
  tray: RayuelaTray = 'REC',
  sinceId?: string,
  pageNumber?: string,
): Promise<RayuelaMessages> => {
  const threshold = parseRayuelaSinceId(sinceId)
  const offset = readRayuelaMessagePageOffset(pageNumber)
  const requestedAt = new Date()
  const page = await fetchRayuelaPageResponse(
    client,
    'RegMisMenPla',
    undefined,
    {
      BANDEJA: tray,
      ...(offset > 0 ? { N_REG_EMPIEZA_PAG: String(offset) } : {}),
    },
  )
  const day = resolveRayuelaResponseDay(
    page.headers['date'],
    requestedAt,
    new Date(),
  )
  return filterRayuelaMessagesSince(
    parseRayuelaMessages(page.text, day, offset),
    threshold,
  )
}
