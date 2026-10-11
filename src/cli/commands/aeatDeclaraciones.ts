import { listAeatFilings } from '../../aeat/filings/listAeatFilings'
import { certificateNifs } from '../../certificate/certificateNifs'
import type { Command } from '../types/Command'

export const aeatDeclaraciones: Command = {
  portal: 'aeat',
  action: 'declaraciones',
  description:
    'Declarations filed at the Agencia Tributaria for one modelo and ejercicio, with the CSV of each receipt (autoliquidaciones only)',
  options: ['nif', 'modelo', 'ejercicio', 'periodo'],
  run: async (client, options, identity) => {
    const nif = options['nif']
    const modelo = options['modelo']
    const ejercicio = options['ejercicio']
    if (!nif || !modelo || !ejercicio)
      throw new Error('--nif, --modelo and --ejercicio are required')
    // SCEJ-MANT answers with the certificate holder's own declarations
    // whatever --nif says, so another NIF would silently list the wrong ones.
    const holders = identity ? certificateNifs(identity) : [nif]
    if (!holders.includes(nif))
      throw new Error(
        `SCEJ-MANT lists only the certificate holder's declarations (${holders.join(', ')}), not those of ${nif}`,
      )
    return listAeatFilings(
      client,
      nif,
      { modelo, ejercicio, periodo: options['periodo'] },
      options['out'],
    )
  },
}
