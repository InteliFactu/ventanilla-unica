import type { RegistryPerson } from './RegistryPerson'

/** What `/people/me/<reference>` answers: the holder. */
export type RegistryMeAnswer = {
  readonly person: RegistryPerson
}
