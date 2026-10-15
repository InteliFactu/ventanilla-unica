import { planRelecInstance } from '../../sta/relec/planRelecInstance'
import { validateRelecInstanceQuery } from '../../sta/relec/validators/validateRelecInstanceQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica caceres instancia`: plan an "Instancia general" through the Cáceres sede's Relec form. */
export const caceresInstancia: Command = {
  portal: 'caceres',
  action: 'instancia',
  description:
    'Plan an "Instancia general" at the Ayuntamiento de Cáceres sede (Relec form): --asunto, --documentos a.pdf,b.pdf, --filas "Instancia General|Otros documentos de entrada" (one form row per document, by name or DocReq id; see caceres procedimiento), optional --representado NIF, --correo, --telefono. Checks the PDFs, logs in and maps each to its row; --confirmar si refuses until the submission is captured',
  options: [
    'asunto',
    'documentos',
    'filas',
    'representado',
    'correo',
    'telefono',
  ],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'caceres instancia needs the holder certificate (--cert/--key)',
      )
    return planRelecInstance(client, validateRelecInstanceQuery(options), {
      identity,
      confirmed: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
