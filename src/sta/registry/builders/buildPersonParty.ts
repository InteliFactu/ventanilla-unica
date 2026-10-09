import { formatPersonName } from '../formatters/formatPersonName'
import { formatPersonNif } from '../formatters/formatPersonNif'
import type { RegistryPartyRole } from '../types/RegistryPartyRole'
import type { RegistryPerson } from '../types/RegistryPerson'

/**
 * One party of the `parties` block as the SPA sends it: the person as
 * `/people/me` returns it, minus `represented`, plus `personality` and the
 * postal address the party is reached at (`party`, `null` for none).
 */
export const buildPersonParty = (
  person: RegistryPerson,
  role: RegistryPartyRole,
): Readonly<Record<string, unknown>> => {
  const { represented: _represented, ...rest } = person
  return {
    id: person.dboid,
    displayId: formatPersonNif(person),
    displayName: formatPersonName(person),
    type: person.persontype,
    isAgent: role.isAgent,
    isAuthenticated: true,
    value: { ...rest, personality: person.persontype, party: role.party },
    hasAddress: role.party !== null,
  }
}
