import type { HttpClient } from '../../http/types/HttpClient'
import { parseTeaExpedientes } from './parsers/parseTeaExpedientes'
import { teaExpedientesUrl } from './teaExpedientesUrl'
import type { TeaExpedientesResult } from './types/TeaExpedientesResult'

/** Read the TEA case list of the certificate holder; one GET, nothing written. */
export const listTeaExpedientes = async (
  client: HttpClient,
  nif: string,
): Promise<TeaExpedientesResult> => {
  const page = await client.request(teaExpedientesUrl)
  return parseTeaExpedientes(page.text, nif)
}
