import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaMessages } from './parsers/parseRayuelaMessages'
import type { RayuelaMessages } from './types/RayuelaMessages'
import type { RayuelaTray } from './types/RayuelaTray'
/** Read the Rayuela messages page (inbox by default) through the password session. */
export const listRayuelaMessages = async (
  client: HttpClient,
  tray: RayuelaTray = 'REC',
): Promise<RayuelaMessages> =>
  parseRayuelaMessages(
    await fetchRayuelaPage(client, 'RegMisMenPla', undefined, {
      BANDEJA: tray,
    }),
  )
