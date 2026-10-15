import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaMessages } from './parsers/parseRayuelaMessages'
import type { RayuelaMessages } from './types/RayuelaMessages'
/** Read the Rayuela messages page through the password session. */
export const listRayuelaMessages = async (
  client: HttpClient,
): Promise<RayuelaMessages> =>
  parseRayuelaMessages(await fetchRayuelaPage(client, 'RegMisMenPla'))
