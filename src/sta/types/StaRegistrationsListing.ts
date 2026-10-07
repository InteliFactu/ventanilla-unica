import type { StaRegistration } from './StaRegistration'

/** The holder's registry entries at an STA sede and the host that served them. */
export type StaRegistrationsListing = {
  readonly host: string
  readonly registrations: readonly StaRegistration[]
}
