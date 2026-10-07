import type { GobexRecord } from './GobexRecord'

/** The expedientes the holder takes part in through a representative. */
export type JuntaRepresentedExpedientes = {
  readonly expedientes: readonly GobexRecord[]
}
