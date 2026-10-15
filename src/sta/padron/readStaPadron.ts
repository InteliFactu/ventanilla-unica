import type { HttpClient } from '../../http/types/HttpClient'
import { fetchStaPageText } from '../fetchers/fetchStaPageText'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import { parseStaPadron } from './parsers/parseStaPadron'
import type { StaPadron } from './types/StaPadron'

/**
 * The holder's padrón entry at the Ayuntamiento de Cáceres. Only that sede
 * keeps a padrón: the Junta's answers its page with a search error. The
 * certificate buttons on the page are not pressed.
 */
export const readStaPadron = async (client: HttpClient): Promise<StaPadron> => {
  const origin = staOrigins.caceres
  await openStaSession(client, origin)
  const html = await fetchStaPageText(client, origin, 'DATOS_HABITANTE')
  return parseStaPadron(html, new URL(origin).hostname)
}
