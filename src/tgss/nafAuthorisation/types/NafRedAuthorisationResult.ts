import type { NafRedAuthorisation } from './NafRedAuthorisation'

/** What `tgss autorizado-naf` reports: the holder, the RED authorisation managing its NAF now, and the history. */
export type NafRedAuthorisationResult = {
  readonly titular: string
  /** The authorisation the NAF is assigned to today (`NO AS.` when none). */
  readonly autorizacionActual: string
  readonly historial: readonly NafRedAuthorisation[]
  readonly notes: readonly string[]
}
