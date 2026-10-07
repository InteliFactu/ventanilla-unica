import type { RegistryPerson } from './RegistryPerson'
import type { RegistrySchema } from './RegistrySchema'
import type { RegistrySession } from './RegistrySession'

/** The read-only half of a registry filing: origin, draft session, holder and procedure schema. */
export type RegistryContext = {
  readonly origin: string
  readonly session: RegistrySession
  readonly person: RegistryPerson
  readonly schema: RegistrySchema
}
