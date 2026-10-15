import type { HttpClient } from '../../http/types/HttpClient'
import { justiciaUrls } from './justiciaUrls'
import { parseVisorSession } from './parsers/parseVisorSession'
import { selectExpedienteHref } from './selectors/selectExpedienteHref'
import { selectVisorLink } from './selectors/selectVisorLink'
import type { VisorSession } from './types/VisorSession'

/**
 * Open the visor of one expediente of an already logged-in holder: the list
 * card by index, its detail page, then the Atenea IRIS link it carries. The
 * visor refuses some expedientes server-side ("No tiene acceso al
 * procedimiento"); those detail pages carry no link.
 */
export const openVisor = async (
  client: HttpClient,
  index: number,
): Promise<VisorSession> => {
  const list = await client.request(justiciaUrls.expedientes)
  const href = selectExpedienteHref(list.text, index)
  if (!href)
    throw new Error(`Justicia: no expediente with index ${String(index)}`)
  const detail = await client.request(href, { referer: list.url })
  const link = selectVisorLink(detail.text)
  if (!link)
    throw new Error(
      `Justicia: expediente ${String(index)} offers no document visor`,
    )
  const visor = await client.request(link, { referer: detail.url })
  return parseVisorSession(visor.text, visor.url)
}
