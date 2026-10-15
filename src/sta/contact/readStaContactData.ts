import type { HttpClient } from '../../http/types/HttpClient'
import { fetchStaPageText } from '../fetchers/fetchStaPageText'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import type { StaPortal } from '../types/StaPortal'
import { parseStaContactData } from './parsers/parseStaContactData'
import type { StaContactData } from './types/StaContactData'

/** The holder's contact data and identity as an STA sede holds them; the "Modificar" and "Sí/No" buttons are never pressed. */
export const readStaContactData = async (
  client: HttpClient,
  portal: StaPortal,
): Promise<StaContactData> => {
  const origin = staOrigins[portal]
  await openStaSession(client, origin)
  const html = await fetchStaPageText(client, origin, 'DATOS_PERSONALES')
  return parseStaContactData(html, new URL(origin).hostname)
}
