import type { StaCohabitant } from './StaCohabitant'

/** The holder's padrón entry at the Ayuntamiento de Cáceres, or `registered: false` when the sede says they are not inscribed. */
export type StaPadron = {
  readonly host: string
  readonly registered: boolean
  readonly name?: string | undefined
  readonly document?: string | undefined
  /** "Fecha alta padrón", dd/mm/yyyy. */
  readonly since?: string | undefined
  readonly address?: string | undefined
  readonly nationality?: string | undefined
  readonly birthDate?: string | undefined
  readonly birthPlace?: string | undefined
  readonly education?: string | undefined
  readonly district?: string | undefined
  readonly section?: string | undefined
  readonly cohabitants: readonly StaCohabitant[]
}
