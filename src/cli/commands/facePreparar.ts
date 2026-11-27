import { prepareFaceInvoice } from '../../face/prepareFaceInvoice'
import { readContentFile } from '../../signing/xades/fetchers/readContentFile'
import { writeSignedFile } from '../../signing/xades/writeSignedFile'
import type { Command } from '../types/Command'

export const facePreparar: Command = {
  portal: 'face',
  action: 'preparar',
  description:
    'Sign one local Facturae 3.2.2 invoice for FACe (--in invoice.xml, --out invoice.xsig)',
  options: ['in'],
  effect: 'sign',
  run: async (_client, options, identity): Promise<unknown> => {
    const input = options['in']
    const out = options['out']
    if (!input) throw new Error('--in is required (the Facturae XML)')
    if (!out?.toLowerCase().endsWith('.xsig')) {
      throw new Error('--out must be an .xsig file')
    }
    if (input === out) throw new Error('--out must differ from --in')
    if (identity === undefined) {
      throw new Error(
        'face preparar needs the holder certificate (--cert/--key)',
      )
    }
    const { xml, signatureId } = prepareFaceInvoice(
      identity,
      await readContentFile(input),
    )
    await writeSignedFile(out, xml)
    return { out, bytes: xml.length, signatureId }
  },
}
