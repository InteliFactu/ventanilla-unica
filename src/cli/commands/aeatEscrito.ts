import { fileProcedureWriting } from '../../aeat/documentFiling/fileProcedureWriting'
import { validateProcedureFilingOptions } from '../../aeat/documentFiling/validators/validateProcedureFilingOptions'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatEscrito: Command = {
  portal: 'aeat',
  action: 'escrito',
  description:
    "File a writing (a solicitud, a recurso) at the Agencia Tributaria's registry under a procedure's trámite when no notification CSV exists, in the holder's own name or, with --nif, en representación de terceros for that interesado (--tramite GZ285, [--nif], --asunto, --telefono, [--correo], --documentos a.pdf,b.pdf, [--tipos 231,200]). Without --confirmar si it only opens the trámite's form and plans; confirmed, it uploads, checks that the signature step lists exactly the files and names the --nif as interesado, signs (firma básica) and registers the filing, which counts as presented today, and saves the receipt and the justificante with --out",
  options: [
    'tramite',
    'nif',
    'asunto',
    'telefono',
    'correo',
    'documentos',
    'tipos',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    fileProcedureWriting(client, validateProcedureFilingOptions(options), {
      confirmed: isConfirmed(options),
      outDir: options['out'],
    }),
}
