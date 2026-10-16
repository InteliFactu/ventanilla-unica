import type { Sleep } from '../../../dehu/documents/types/Sleep'
import type { HttpClient } from '../../../http/types/HttpClient'
import { registradoresHeaders } from '../../session/registradoresHeaders'
import { siteUrl } from '../../session/siteUrl'

/**
 * Poll `orden-completa` as the "Procesando" page does, until it answers the
 * bare body `true` (the order exists and `pago-orden` can be read).
 */
export const waitForOrder = async (
  client: HttpClient,
  sleep: Sleep,
): Promise<void> => {
  const attempts = 20
  const intervalMs = 8000
  const url = siteUrl('certificado/solicitud/orden-completa')
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) await sleep(intervalMs)
    const answer = await client.request(url, {
      headers: registradoresHeaders,
      followRedirects: false,
    })
    if (answer.text.trim() === 'true') return
  }
  throw new Error(
    'registradores: the order was not complete after the sede\'s processing wait; it may still appear in "Mis pedidos"',
  )
}
