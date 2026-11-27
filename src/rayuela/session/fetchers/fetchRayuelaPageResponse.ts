import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { openRayuelaSession } from '../openRayuelaSession'
import { parseRayuelaPageUrl } from '../parsers/parseRayuelaPageUrl'
import { switchRayuelaSessionChild } from '../switchRayuelaSessionChild'
import { fetchRayuelaResponse } from './fetchRayuelaResponse'

/** Fetch a menu page with its response headers; `query` adds page parameters such as `BANDEJA`. */
export const fetchRayuelaPageResponse = async (
  client: HttpClient,
  name: string,
  child?: string,
  query: Readonly<Record<string, string>> = {},
): Promise<HttpResponse> => {
  const session = await openRayuelaSession(client)
  const menu = await fetchRayuelaResponse(client, session.menu)
  const url = `${parseRayuelaPageUrl(menu.text, name, session)}${Object.entries(
    query,
  )
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join('')}`
  if (child !== undefined)
    await switchRayuelaSessionChild(client, session, menu.text, child)
  return fetchRayuelaResponse(client, url)
}
