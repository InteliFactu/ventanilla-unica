import type { CliOptions } from '../../../cli/types/CliOptions'
import type { StaRegistryQuery } from '../types/StaRegistryQuery'
import { parseDocumentList } from './parseDocumentList'

/** The raw `--destino`, `--telefono`, `--asunto` and `--documentos` values, normalised but not yet checked. */
export const readRegistryOptions = (options: CliOptions): StaRegistryQuery => ({
  destination: (options['destino'] ?? '').trim().toUpperCase(),
  phone: (options['telefono'] ?? '').replace(/\s/g, ''),
  subject: (options['asunto'] ?? '').trim(),
  documents: parseDocumentList(options['documentos']),
})
