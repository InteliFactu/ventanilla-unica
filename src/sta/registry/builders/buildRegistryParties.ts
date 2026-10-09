import type { RegistryPerson } from '../types/RegistryPerson'
import { buildPersonParty } from './buildPersonParty'

/**
 * The `parties` block. In the holder's own name the holder is the `subject`;
 * acting for an entity, as the SPA's "representacionjuridica" step does with
 * a representative certificate, the entity is the `subject` and the holder
 * the `representedBy` agent, reached at their first address.
 */
export const buildRegistryParties = (
  person: RegistryPerson,
  represented?: RegistryPerson,
): Readonly<Record<string, unknown>> => {
  const holder = { party: person.addreses?.[0] ?? null }
  if (represented === undefined)
    return { subject: buildPersonParty(person, { ...holder, isAgent: false }) }
  return {
    representedBy: buildPersonParty(person, { ...holder, isAgent: true }),
    subject: buildPersonParty(represented, {
      isAgent: false,
      party:
        (represented['party'] as
          Readonly<Record<string, unknown>> | null | undefined) ?? null,
    }),
  }
}
