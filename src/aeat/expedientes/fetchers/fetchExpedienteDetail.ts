import type { HttpClient } from '../../../http/types/HttpClient'

/** Read one detail page from the AEAT list; refuse an untrusted destination. */
export const fetchExpedienteDetail = async (
  client: HttpClient,
  url: string,
): Promise<string> => {
  const parsed = new URL(url)
  if (
    parsed.origin !== 'https://www1.agenciatributaria.gob.es' ||
    parsed.pathname !== '/wlpl/TEWV-CORE/DetalleVlt' ||
    !/^[A-Z0-9]+$/.test(parsed.searchParams.get('evt') ?? '')
  )
    throw new Error('AEAT: unexpected expediente detail URL')
  const response = await client.request(url, { defaultCharset: 'iso-8859-15' })
  if (response.status !== 200)
    throw new Error(`AEAT: expediente detail HTTP ${String(response.status)}`)
  return response.text
}
