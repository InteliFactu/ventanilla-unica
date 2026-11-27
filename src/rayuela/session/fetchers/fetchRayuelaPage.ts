import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchRayuelaPageResponse } from './fetchRayuelaPageResponse'

/** Read the HTML of a Rayuela menu page. */
export const fetchRayuelaPage = async (
  client: HttpClient,
  name: string,
  child?: string,
  query: Readonly<Record<string, string>> = {},
): Promise<string> =>
  (await fetchRayuelaPageResponse(client, name, child, query)).text
