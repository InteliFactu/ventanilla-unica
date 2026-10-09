import type { RegistryContributionTarget } from './RegistryContributionTarget'

/** Everything a registry save carries besides the documents, plus the description each attachment is listed with. */
export type RegistryContent = {
  readonly parties: Readonly<Record<string, unknown>>
  readonly data?: readonly Readonly<Record<string, unknown>>[] | undefined
  readonly apordoc?: RegistryContributionTarget | undefined
  readonly notificationEmail: string
  readonly descriptions?: readonly string[] | undefined
}
