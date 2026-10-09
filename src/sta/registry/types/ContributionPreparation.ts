import type { RegistryContent } from './RegistryContent'
import type { RegistryContributionTarget } from './RegistryContributionTarget'
import type { RegistryPerson } from './RegistryPerson'
import type { RegistrySession } from './RegistrySession'
import type { RegistrySlot } from './RegistrySlot'

/** Everything the read-only half of a contribution establishes, ready for the plan and for the write half. */
export type ContributionPreparation = {
  readonly origin: string
  readonly session: RegistrySession
  readonly person: RegistryPerson
  readonly slot: RegistrySlot
  readonly content: RegistryContent & {
    readonly apordoc: RegistryContributionTarget
  }
  readonly plan: readonly string[]
}
