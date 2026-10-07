import type { StaExpediente } from './StaExpediente'

/** The holder's expedientes at an STA sede and the host that served them. */
export type StaExpedientesListing = {
  readonly host: string
  readonly expedientes: readonly StaExpediente[]
}
