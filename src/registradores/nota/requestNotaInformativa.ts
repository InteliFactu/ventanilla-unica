import { defaultSleep } from '../../dehu/documents/defaultSleep'
import type { Sleep } from '../../dehu/documents/types/Sleep'
import type { HttpClient } from '../../http/types/HttpClient'
import { writeFilingFiles } from '../../rolece/filing/writeFilingFiles'
import { mapCheckoutPage } from './mappers/mapCheckoutPage'
import { mapNotaPlan } from './mappers/mapNotaPlan'
import { orderNota } from './orderNota'
import { prepareNota } from './prepareNota'
import type { NotaQuery } from './types/NotaQuery'
import type { NotaResult } from './types/NotaResult'

/**
 * Order a nota informativa mercantil at sede.registradores.org as the
 * certificate's representative. The plan walks to the identification page
 * and stops: the price appears only after identification, which creates the
 * order. Confirmed, it creates the order for card payment and answers the
 * hosted checkout URL (and with `--out` a page that opens it). It never pays.
 */
export const requestNotaInformativa = async (
  client: HttpClient,
  query: NotaQuery,
  confirmed: boolean,
  sleep: Sleep = defaultSleep,
): Promise<NotaResult> => {
  const prepared = await prepareNota(client, query)
  const base = {
    action: 'registradores nota',
    plan: mapNotaPlan(query, prepared),
    company: prepared.company,
    accountsDepositAvailable: prepared.accountsDepositAvailable,
  }
  if (!confirmed)
    return {
      ...base,
      executed: false,
      notes: [
        'Nothing ordered: the walk stopped on the identification page; the sede shows the price only after identification, which creates the order.',
        'With --confirmar si (and --direccion, --codigo-postal) it creates the order for card payment and prints the checkout URL; paying stays with you.',
      ],
    }
  const receipt = await orderNota(client, prepared, sleep)
  const day = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Madrid',
  })
  const files = query.outDir
    ? await writeFilingFiles(
        query.outDir,
        `registradores-nota-${query.nif}-${day}`,
        {
          '-pago.html': Buffer.from(mapCheckoutPage(receipt.checkoutUrl)),
        },
      )
    : { written: [], failed: [] }
  return {
    ...base,
    executed: true,
    receipt: { ...receipt, checkoutPage: files.written[0] },
    notes: [
      'Order created; nothing is paid until the card is entered on the checkout page (the amount is preauthorised).',
      `Once paid, the nota is e-mailed to ${query.email}.`,
      ...files.failed,
    ],
  }
}
