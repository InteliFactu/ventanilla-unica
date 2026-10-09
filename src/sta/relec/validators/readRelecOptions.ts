import type { CliOptions } from '../../../cli/types/CliOptions'
import { parseDocumentList } from '../../registry/validators/parseDocumentList'
import type { RelecQuery } from '../types/RelecQuery'
import { splitDescriptions } from './splitDescriptions'

/** The raw `caceres aportar` options, normalised but not yet checked. */
export const readRelecOptions = (options: CliOptions): RelecQuery => ({
  reference: (options['referencia'] ?? '').trim().toUpperCase(),
  documents: parseDocumentList(options['documentos']),
  typeCodes: parseDocumentList(options['tipos']).map((code) =>
    code.toUpperCase(),
  ),
  descriptions: splitDescriptions(options['descripciones']),
  information: options['informacion']?.trim() || undefined,
  email: options['correo']?.trim() || undefined,
  phone: options['telefono']?.replaceAll(/\s/g, '') || undefined,
})
