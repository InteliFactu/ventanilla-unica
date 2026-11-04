import { fileRelecTramite } from '../../sta/relec/fileRelecTramite'
import { validateRelecTramiteQuery } from '../../sta/relec/validators/validateRelecTramiteQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** File a catalogue procedure exclusively in the certificate holder's own name. */
export const caceresTramite: Command = {
  portal: 'caceres',
  action: 'tramite',
  description:
    "File a Cáceres catalogue Relec procedure in the certificate holder's OWN name: --dboid, --asunto, --documentos a.pdf,b.pdf, --slots slotDboid,slotName (one PDF per slot; required slots must be covered), optional --correo, --telefono, --out. Without --confirmar si only checks PDFs, logs in, opens the form and prints the plan. Confirmation uploads and PAdES-signs each PDF, XAdES-signs the form and registers it; --out saves the justificante and JSON receipt",
  options: ['dboid', 'asunto', 'documentos', 'slots', 'correo', 'telefono'],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'caceres tramite needs the holder certificate (--cert/--key)',
      )
    return fileRelecTramite(client, validateRelecTramiteQuery(options), {
      identity,
      confirmed: isConfirmed(options),
      outDir: options['out'],
    })
  },
}
