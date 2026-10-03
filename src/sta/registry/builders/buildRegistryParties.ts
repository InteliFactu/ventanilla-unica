import { formatPersonNif } from '../formatters/formatPersonNif'
import type { RegistryPerson } from '../types/RegistryPerson'

/**
 * The `parties` block for a holder acting in their own name: the person as
 * `/people/me` returns it, minus `represented`, plus `personality` and the
 * first address as `party`, which is what the SPA sends.
 */
export const buildRegistryParties = (
  person: RegistryPerson,
): Readonly<Record<string, unknown>> => {
  const { represented: _represented, ...rest } = person
  const displayName = [person.name, person.familyname, person.secondname]
    .filter(Boolean)
    .join(' ')
  return {
    subject: {
      id: person.dboid,
      displayId: formatPersonNif(person),
      displayName,
      type: person.persontype,
      isAgent: false,
      isAuthenticated: true,
      value: {
        ...rest,
        personality: person.persontype,
        party: person.addreses[0],
      },
      hasAddress: person.addreses.length > 0,
    },
  }
}
