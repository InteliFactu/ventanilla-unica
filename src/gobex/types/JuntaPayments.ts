import type { GobexRecord } from './GobexRecord'

/** What the Junta paid or owes the holder in one year, with the third-party incidents. */
export type JuntaPayments = {
  readonly ejercicio: string
  readonly payments: readonly GobexRecord[]
  readonly incidents: readonly GobexRecord[]
}
