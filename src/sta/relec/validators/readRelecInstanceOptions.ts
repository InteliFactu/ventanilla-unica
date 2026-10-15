import type { CliOptions } from '../../../cli/types/CliOptions'
import { parseDocumentList } from '../../registry/validators/parseDocumentList'
import type { RelecInstanceQuery } from '../types/RelecInstanceQuery'
import { splitDescriptions } from './splitDescriptions'

/** The raw `caceres instancia` options, normalised but not yet checked. */
export const readRelecInstanceOptions = (
  options: CliOptions,
): RelecInstanceQuery => ({
  subject: options['asunto']?.trim() ?? '',
  documents: parseDocumentList(options['documentos']),
  rows: splitDescriptions(options['filas']),
  represented: options['representado']?.trim().toUpperCase() || undefined,
  email: options['correo']?.trim() || undefined,
  phone: options['telefono']?.replaceAll(/\s/g, '') || undefined,
})
