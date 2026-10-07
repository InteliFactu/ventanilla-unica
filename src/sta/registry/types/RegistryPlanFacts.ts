import type { RegistryPdfFile } from './RegistryPdfFile'

/** What a registry plan states: the addressee unit, the notice e-mail and the files. */
export type RegistryPlanFacts = {
  readonly unitLabel: string
  readonly notificationEmail: string
  readonly files: readonly RegistryPdfFile[]
}
