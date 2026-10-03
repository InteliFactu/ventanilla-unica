import { emitComplianceCertificate } from '../../aeat/compliance/emitComplianceCertificate'
import { validateCompliancePurpose } from '../../aeat/compliance/validators/validateCompliancePurpose'
import type { Command } from '../types/Command'

/** `ventanilla-unica aeat certificado-corriente --nif <NIF> [--finalidad <purpose>] [--out <dir>]`: emit a "certificado de estar al corriente de obligaciones tributarias". */
export const aeatCertificadoCorriente: Command = {
  portal: 'aeat',
  action: 'certificado-corriente',
  description:
    "Emit the holder's 'certificado de estar al corriente de obligaciones tributarias' at the Agencia Tributaria (--finalidad contratacion|subvenciones|generico, default contratacion; the PDF with --out; the JSON says whether it came out POSITIVO)",
  options: ['nif', 'finalidad'],
  effect: 'emit',
  run: async (client, options): Promise<unknown> => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    const purpose = validateCompliancePurpose(options['finalidad'])
    return emitComplianceCertificate(client, { nif, purpose }, options['out'])
  },
}
