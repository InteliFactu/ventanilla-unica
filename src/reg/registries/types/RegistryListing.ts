import type { RegUser } from '../../session/types/RegUser'
import type { RegistrySummary } from './RegistrySummary'

/** One page of the holder's registry entries. */
export type RegistryListing = {
  readonly holder: RegUser
  readonly page: number
  readonly totalPages: number
  readonly registries: readonly RegistrySummary[]
}
