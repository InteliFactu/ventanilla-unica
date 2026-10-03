import { fileStaRegistryEntry } from '../../sta/registry/fileStaRegistryEntry'
import { validateRegistryQuery } from '../../sta/registry/validators/validateRegistryQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const juntaPresentar: Command = {
  portal: 'junta',
  action: 'presentar',
  description:
    "File a PDF writ in the Junta de Extremadura's Registro Electrónico General in the holder's own name (--destino DIR3, --telefono, --asunto, --documentos a.pdf,b.pdf); --confirmar si to submit, with --out to save the justificante",
  options: ['destino', 'telefono', 'asunto', 'documentos'],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'junta presentar needs the holder certificate (--cert/--key)',
      )
    return fileStaRegistryEntry(
      client,
      'junta',
      validateRegistryQuery(options),
      {
        identity,
        confirmed: isConfirmed(options),
        outDir: options['out'],
      },
    )
  },
}
