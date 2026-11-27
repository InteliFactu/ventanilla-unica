import { emitUpToDateCertificate } from '../../tgss/certificates/emitUpToDateCertificate'
import { validateCertificateKind } from '../../tgss/certificates/validators/validateCertificateKind'
import type { Command } from '../types/Command'

/** Emit and download a TGSS certificate of being up to date. */
export const tgssCorriente: Command = {
  portal: 'tgss',
  action: 'corriente',
  description:
    "Emit and download a TGSS 'certificado de estar al corriente' (dated kinds need --fecha DD/MM/YYYY; both tender kinds need --entidad <NIF>; each emission counts against the daily cap)",
  options: ['nif', 'tipo', 'entidad', 'fecha'],
  run: async (client, options): Promise<unknown> => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    const kind = validateCertificateKind(options['tipo'])
    return emitUpToDateCertificate(client, nif, kind, {
      outDir: options['out'],
      contractingEntityNif: options['entidad'],
      referenceDate: options['fecha'],
    })
  },
}
