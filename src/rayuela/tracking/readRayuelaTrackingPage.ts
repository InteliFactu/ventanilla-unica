import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaTrackingTable } from './parsers/parseRayuelaTrackingTable'
import { RAYUELA_TRACKING_PAGES } from './RAYUELA_TRACKING_PAGES'
import type { RayuelaTrackingTable } from './types/RayuelaTrackingTable'

/** Read the selected pupil's table using the live menu entry. */
export const readRayuelaTrackingPage = async (
  client: HttpClient,
  page: keyof typeof RAYUELA_TRACKING_PAGES,
  child?: string,
): Promise<RayuelaTrackingTable> =>
  parseRayuelaTrackingTable(
    await fetchRayuelaPage(client, RAYUELA_TRACKING_PAGES[page], child),
  )
