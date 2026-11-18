import { listAeatPayments } from '../../aeat/payments/listAeatPayments'
import { certificateNifs } from '../../certificate/certificateNifs'
import type { Command } from '../types/Command'

export const aeatPagos: Command = {
  portal: 'aeat',
  action: 'pagos',
  description:
    'Payments made at the Agencia Tributaria (MisPagos), with their receipt PDFs when --out is given',
  options: ['nif'],
  run: async (client, options, identity): Promise<unknown> => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    // MisPagos answers with the certificate holder's payments even after a
    // representation switch (checked 2026-11-18), so another NIF is refused.
    const holders = identity ? certificateNifs(identity) : [nif]
    if (!holders.includes(nif))
      throw new Error(
        `MisPagos lists only the certificate holder's payments (${holders.join(', ')}), not those of ${nif}`,
      )
    return listAeatPayments(client, nif, options['out'])
  },
}
