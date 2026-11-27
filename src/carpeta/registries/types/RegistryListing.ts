import type { RegistryEntry } from './RegistryEntry'

/** The answer of `carpeta registros`. */
export type RegistryListing = {
  /** `num_total_resultados`, the count the Carpeta reports for the range. */
  readonly total: number
  readonly entries: readonly RegistryEntry[]
  /** The distinct `textoRespuesta` of every warning page (`codRespuesta` 1), in page order. */
  readonly warnings: readonly string[]
}
