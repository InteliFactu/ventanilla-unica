import { fileRelecContribution } from '../../sta/relec/fileRelecContribution'
import { validateRelecQuery } from '../../sta/relec/validators/validateRelecQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica caceres aportar`: contribute documents through the Cáceres sede's Relec "Aportación de documentación". */
export const caceresAportar: Command = {
  portal: 'caceres',
  action: 'aportar',
  description:
    'Contribute PDFs to an expediente or registry entry at the Ayuntamiento de Cáceres sede ("Aportación de documentación", Relec form) as representative of the entity the certificate represents: --referencia AÑO/NUMERO|ENT..., --documentos a.pdf,b.pdf, --tipos DECL,ALTER (one per document, as the sede lists them), --descripciones "d1|d2", optional --informacion, --correo, --telefono (default: the form\'s prefilled contact). Each PDF is signed PAdES and the form XAdES, locally. --confirmar si to register, with --out to save the justificante and a JSON receipt',
  options: [
    'referencia',
    'documentos',
    'tipos',
    'descripciones',
    'informacion',
    'correo',
    'telefono',
  ],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'caceres aportar needs the holder certificate (--cert/--key)',
      )
    return fileRelecContribution(client, validateRelecQuery(options), {
      identity,
      confirmed: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
