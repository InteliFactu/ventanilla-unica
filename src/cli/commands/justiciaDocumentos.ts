import type { HttpClient } from '../../http/types/HttpClient'
import { listJusticiaDocuments } from '../../justicia/documents/listJusticiaDocuments'
import type { CliOptions } from '../types/CliOptions'
import type { Command } from '../types/Command'

/** `ventanilla-unica justicia documentos`: one expediente's documents, saved with `--out`. */
export const justiciaDocumentos: Command = {
  portal: 'justicia',
  action: 'documentos',
  description:
    'List the documents of one expediente in the Atenea IRIS visor of the Carpeta Justicia (--expediente <index> from `justicia expedientes`); with --out, download each one',
  options: ['expediente'],
  run: async (client: HttpClient, options: CliOptions): Promise<unknown> => {
    const index = Number(options['expediente'])
    if (
      options['expediente'] === undefined ||
      !Number.isInteger(index) ||
      index < 0
    )
      throw new Error(
        '--expediente <index> is required: the index `justicia expedientes` gives',
      )
    return listJusticiaDocuments(client, { index, outDir: options['out'] })
  },
}
