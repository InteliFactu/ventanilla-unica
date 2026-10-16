import type { Sleep } from '../../dehu/documents/types/Sleep'
import type { HttpClient } from '../../http/types/HttpClient'
import { registradoresHeaders } from '../session/registradoresHeaders'
import { siteUrl } from '../session/siteUrl'
import { postNotaStep } from './fetchers/postNotaStep'
import { waitForOrder } from './fetchers/waitForOrder'
import { notaPaymentFields } from './mappers/notaPaymentFields'
import { readCheckoutUrl } from './parsers/readCheckoutUrl'
import { readNotaPrice } from './parsers/readNotaPrice'
import type { NotaReceipt } from './types/NotaReceipt'
import type { PreparedNota } from './types/PreparedNota'
import { assertNotaPage } from './validators/assertNotaPage'

/**
 * Create the order: post the identification, read the price on the pago
 * page, choose card payment, wait for the order and read the hosted checkout
 * it would auto-post to. Nothing is paid here; from `pagar` on no redirect is
 * followed, so the certificate never reaches the payment host.
 */
export const orderNota = async (
  client: HttpClient,
  prepared: PreparedNota,
  sleep: Sleep,
): Promise<NotaReceipt> => {
  const pago = await postNotaStep(
    client,
    'invitado/confirmar-identificacion-invitado',
    prepared.csrf,
    prepared.identification,
  )
  assertNotaPage(pago, 'solicitud/pagar', 'the identification')
  await client.request(siteUrl('certificado/solicitud/pagar'), {
    method: 'POST',
    form: { _csrf: prepared.csrf, ...notaPaymentFields },
    headers: registradoresHeaders,
    followRedirects: false,
  })
  await waitForOrder(client, sleep)
  const order = await client.request(
    siteUrl('certificado/solicitud/pago-orden'),
    { headers: registradoresHeaders, followRedirects: false },
  )
  const checkoutUrl = readCheckoutUrl(order.text)
  if (checkoutUrl === undefined)
    throw new Error(
      `registradores: pago-orden carried no checkout form (HTTP ${String(order.status)})`,
    )
  return { price: readNotaPrice(pago.text), checkoutUrl }
}
