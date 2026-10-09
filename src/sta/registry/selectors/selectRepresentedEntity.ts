import type { RegistryPerson } from '../types/RegistryPerson'

/**
 * The entity the holder acts for, by the SPA's own rule: a certificate whose
 * first `represented` entry is `onlyagent` (a representative certificate)
 * can only act for it; any other holder files in their own name.
 */
export const selectRepresentedEntity = (
  person: RegistryPerson,
): RegistryPerson | undefined => {
  const first = person.represented?.[0]
  return first?.onlyagent === true ? first : undefined
}
