import { downloadAeatCsvDocument } from '../../aeat/csvDocument/downloadAeatCsvDocument'
import type { Command } from '../types/Command'

/** `ventanilla-unica aeat cotejo --csv C --out dir [--nif N]`: save the document an AEAT CSV verifies. */
export const aeatCotejo: Command = {
  portal: 'aeat',
  action: 'cotejo',
  description:
    'Save the PDF behind an Agencia Tributaria CSV (Cotejo de documentos) into --out, read-only (--csv, --nif of the addressee)',
  options: ['csv', 'nif'],
  run: async (client, options): Promise<unknown> => {
    const csv = options['csv']
    const out = options['out']
    if (!csv) throw new Error('--csv is required')
    if (!out) throw new Error('--out is required')
    return downloadAeatCsvDocument(client, {
      csv,
      nif: options['nif'] ?? '',
      out,
    })
  },
}
