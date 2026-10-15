import { signPdfFile } from '../../signing/pades/signPdfFile'
import { validateSignPdfQuery } from '../../signing/pades/validators/validateSignPdfQuery'
import type { Command } from '../types/Command'

export const firmarPdf: Command = {
  portal: 'firmar',
  action: 'pdf',
  description:
    'Sign a PDF locally with the certificate (PAdES-B-B, incremental update): --in <file> --out <file> [--visible si] [--motivo t] [--lugar t] [--contacto t] [--pagina n|-1] [--posicion llx,lly,urx,ury] [--texto t] [--campo name]',
  options: [
    'in',
    'visible',
    'motivo',
    'lugar',
    'contacto',
    'pagina',
    'posicion',
    'texto',
    'campo',
  ],
  effect: 'sign',
  run: async (_client, options, identity): Promise<unknown> => {
    const request = validateSignPdfQuery(options)
    if (!identity)
      throw new Error('firmar pdf needs the certificate: --cert and --key')
    return signPdfFile(identity, request)
  },
}
