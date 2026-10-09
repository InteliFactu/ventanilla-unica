import type { RegistryExpediente } from './RegistryExpediente'
import type { RegistryPdfFile } from './RegistryPdfFile'
import type { RegistryPerson } from './RegistryPerson'

/** What a contribution plan states besides the query: who files, for whom, into which file, the notice e-mail and the files. */
export type ContributionPlanFacts = {
  readonly holder: RegistryPerson
  readonly represented?: RegistryPerson | undefined
  readonly expediente: RegistryExpediente
  readonly notificationEmail: string
  readonly files: readonly RegistryPdfFile[]
}
