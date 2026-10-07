import type { GobexRecord } from './GobexRecord'

/** The expedientes found in a date range of the Carpeta Ciudadana, with the range asked. */
export type JuntaCarpetaExpedientes = {
  readonly desde: string
  readonly hasta: string
  readonly expedientes: readonly GobexRecord[]
}
