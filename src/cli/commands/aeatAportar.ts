import { fileDocumentsWithCsv } from '../../aeat/documentFiling/fileDocumentsWithCsv'
import { validateDocumentFilingOptions } from '../../aeat/documentFiling/validators/validateDocumentFilingOptions'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatAportar: Command = {
  portal: 'aeat',
  action: 'aportar',
  description:
    "File documents (alegaciones, a reply to a requerimiento) at the Agencia Tributaria's registry against the CSV of the notification they answer, as interesado or as the interesado's representative (--csv, --como interesado|representante, --asunto, --telefono, [--correo], --documentos a.pdf,b.pdf, [--tipos 203,200]). Without --confirmar si it only opens the form the CSV resolves to and plans; confirmed, it uploads, signs (firma básica) and registers the filing, which counts as presented today, and saves the receipt and the justificante with --out",
  options: [
    'csv',
    'como',
    'asunto',
    'telefono',
    'correo',
    'documentos',
    'tipos',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    fileDocumentsWithCsv(client, validateDocumentFilingOptions(options), {
      confirmed: isConfirmed(options),
      outDir: options['out'],
    }),
}
