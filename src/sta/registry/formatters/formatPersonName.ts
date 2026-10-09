import type { RegistryPerson } from '../types/RegistryPerson'

/** The name the SPA shows for a party: name parts for a natural person, `cianame` for an entity, upper-cased. */
export const formatPersonName = (person: RegistryPerson): string =>
  (person.persontype === 'F'
    ? [person.name, person.familyname, person.secondname]
        .filter(Boolean)
        .join(' ')
    : (person.cianame ?? '')
  ).toUpperCase()
