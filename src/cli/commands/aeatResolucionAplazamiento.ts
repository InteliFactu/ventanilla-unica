import { readAeatAgreementResolution } from '../../aeat/debts/readAeatAgreementResolution'
import { writeAgreementResolutionPdf } from '../../aeat/debts/writers/writeAgreementResolutionPdf'
import type { Command } from '../types/Command'

/** Download an existing SRAF resolution for the certificate holder. */
export const aeatResolucionAplazamiento: Command = {
  portal: 'aeat',
  action: 'resolucion-aplazamiento',
  description:
    'Save the existing resolution PDF for one of the certificate holder’s deferral agreements (--acuerdo, --out)',
  options: ['acuerdo'],
  run: async (client, options): Promise<unknown> => {
    const agreement = options['acuerdo']
    const out = options['out']
    if (!agreement) throw new Error('--acuerdo is required')
    if (!out) throw new Error('--out is required')
    const pdf = await readAeatAgreementResolution(client, agreement)
    const path = await writeAgreementResolutionPdf(out, agreement, pdf)
    return { agreement, path, bytes: pdf.length }
  },
}
