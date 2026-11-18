import { listAeatFilings } from '../../aeat/filings/listAeatFilings'
import { actAsAeatHolder } from '../../aeat/session/actAsAeatHolder'
import type { Command } from '../types/Command'

export const aeatDeclaraciones: Command = {
  portal: 'aeat',
  action: 'declaraciones',
  description:
    'Declarations filed at the Agencia Tributaria for one modelo and ejercicio, with the CSV of each receipt (autoliquidaciones only)',
  options: ['nif', 'nombre', 'modelo', 'ejercicio', 'periodo'],
  run: async (client, options, identity) => {
    const nif = options['nif']
    const modelo = options['modelo']
    const ejercicio = options['ejercicio']
    if (!nif || !modelo || !ejercicio)
      throw new Error('--nif, --modelo and --ejercicio are required')
    // SCEJ-MANT answers for whoever the session acts for, whatever --nif
    // says, so another NIF must be switched to first.
    await actAsAeatHolder(client, identity, nif, options['nombre'])
    return listAeatFilings(
      client,
      nif,
      { modelo, ejercicio, periodo: options['periodo'] },
      options['out'],
    )
  },
}
