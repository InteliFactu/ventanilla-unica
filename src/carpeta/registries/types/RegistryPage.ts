import type { RegistryEntry } from './RegistryEntry'

/** One page of `consultaRegistros`, already checked and mapped. */
export type RegistryPage = {
  readonly total: number
  readonly entries: readonly RegistryEntry[]
  readonly warning: string | null
}
