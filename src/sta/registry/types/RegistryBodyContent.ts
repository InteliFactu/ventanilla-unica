import type { RegistryContributionTarget } from './RegistryContributionTarget'

/**
 * The parts of a registry save body: the parties, the form values (none for
 * a procedure without a data step), the documents, the optional notice
 * e-mail and, for a contribution to an open file, its `apordoc` target.
 */
export type RegistryBodyContent = {
  readonly parties: Readonly<Record<string, unknown>>
  readonly data?: readonly Readonly<Record<string, unknown>>[] | undefined
  readonly apordoc?: RegistryContributionTarget | undefined
  readonly documents: readonly Readonly<Record<string, unknown>>[]
  readonly notificationEmail?: string | undefined
}
