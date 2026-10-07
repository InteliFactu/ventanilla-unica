import type { GobexRecord } from './GobexRecord'

/** The holder's Junta fees: the paid ones and the payment incidents. */
export type JuntaFees = {
  readonly paid: readonly GobexRecord[]
  readonly incidents: readonly GobexRecord[]
}
