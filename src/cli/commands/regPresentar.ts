import { fileRegEntry } from '../../reg/filing/fileRegEntry'
import { validateFilingQuery } from '../../reg/filing/validators/validateFilingQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const regPresentar: Command = {
  portal: 'reg',
  action: 'presentar',
  description:
    "File a writ in the Registro Electrónico General to any DIR3 unit, in the holder's own name (--organismo code, --asunto, --expone, --solicita, --documentos a.pdf,b.pdf, --tipo-via, --via, --cp, --provincia, --municipio, [--email], [--telefono]); --confirmar si files and signs it, with --out to save the justificante",
  options: [
    'organismo',
    'asunto',
    'expone',
    'solicita',
    'documentos',
    'tipo-via',
    'via',
    'cp',
    'provincia',
    'municipio',
    'email',
    'telefono',
  ],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'reg presentar needs the holder certificate (--cert/--key)',
      )
    return fileRegEntry(client, validateFilingQuery(options), {
      identity,
      confirmed: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
