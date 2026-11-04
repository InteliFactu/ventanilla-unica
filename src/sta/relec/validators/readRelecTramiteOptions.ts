import type { CliOptions } from '../../../cli/types/CliOptions'
import type { RelecTramiteQuery } from '../types/RelecTramiteQuery'
import { readRelecInstanceOptions } from './readRelecInstanceOptions'

/** Normalize the catalogue command using the existing instance option reader. */
export const readRelecTramiteOptions = (
  options: CliOptions,
): RelecTramiteQuery => ({
  ...readRelecInstanceOptions({
    ...options,
    representado: undefined,
    filas: undefined,
  }),
  dboid: options['dboid']?.trim() ?? '',
  rows: options['slots']?.split(',').map((row) => row.trim()) ?? [],
})
