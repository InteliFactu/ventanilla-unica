import { parsePdfPage } from '../parsers/parsePdfPage'
import { parsePdfRect } from '../parsers/parsePdfRect'
import { parsePdfTimestamps } from '../parsers/parsePdfTimestamps'
import type { SignPdfFileRequest } from '../types/SignPdfFileRequest'

/** Check the `ventanilla-unica firmar pdf` options before touching any file. */
export const validateSignPdfQuery = (
  options: Readonly<Record<string, string | undefined>>,
): SignPdfFileRequest => {
  const input = options['in']
  const output = options['out']
  if (!input || !output) throw new Error('--in and --out are required')
  return {
    input,
    output,
    options: {
      visible: options['visible'] === 'si',
      reason: options['motivo'],
      location: options['lugar'],
      contactInfo: options['contacto'],
      page: parsePdfPage(options['pagina']),
      rect: parsePdfRect(options['posicion']),
      text: options['texto'],
      field: options['campo'],
    },
    ...parsePdfTimestamps(options['tsa'], options['sello']),
  }
}
