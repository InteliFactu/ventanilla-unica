import type { CliOptions } from '../../../cli/types/CliOptions'
import type { BulkFilingQuery } from '../types/BulkFilingQuery'

/** --fichero is mandatory; --periodo defaults to 0A, the annual period. */
export const validateBulkFilingOptions = (
  options: CliOptions,
): BulkFilingQuery => {
  const fichero = options['fichero']
  if (!fichero) throw new Error('--fichero is required')
  const periodo = options['periodo'] ?? '0A'
  if (!/^(?:0A|[1-4]T|0[1-9]|1[0-2])$/.test(periodo))
    throw new Error(`--periodo ${periodo} must be 0A, 1T-4T or 01-12`)
  return { fichero, periodo }
}
