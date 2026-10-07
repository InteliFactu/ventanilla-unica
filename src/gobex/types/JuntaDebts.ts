import type { GobexRecord } from './GobexRecord'

/** The holder's Junta debts and how many are still pending. */
export type JuntaDebts = {
  readonly debts: readonly GobexRecord[]
  readonly pending: number
}
