import { fileStaContribution } from '../../sta/registry/fileStaContribution'
import { validateContributionQuery } from '../../sta/registry/validators/validateContributionQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const juntaAportar: Command = {
  portal: 'junta',
  action: 'aportar',
  description:
    'Contribute PDFs to an open Junta de Extremadura expediente ("Aporte documentación", registered as documentación complementaria): --expediente AÑO/NUMERO, --documentos a.pdf,b.pdf, optional --descripciones "d1|d2" and --informacion; a representative certificate files for the entity it represents. --confirmar si to register, with --out to save the justificante',
  options: ['expediente', 'documentos', 'descripciones', 'informacion'],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'junta aportar needs the holder certificate (--cert/--key)',
      )
    return fileStaContribution(
      client,
      'junta',
      validateContributionQuery(options),
      {
        identity,
        confirmed: isConfirmed(options),
        outDir: options['out'],
      },
    )
  },
}
