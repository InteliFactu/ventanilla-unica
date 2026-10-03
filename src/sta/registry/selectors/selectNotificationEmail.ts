import type { RegistryPerson } from '../types/RegistryPerson'

/**
 * The e-mail the summary step preselects for notice of electronic
 * notifications: the holder's default `waycode` 21 contact, else any.
 */
export const selectNotificationEmail = (person: RegistryPerson): string => {
  const emails = person.contacts.filter((contact) => contact.waycode === '21')
  const chosen = emails.find((contact) => contact.default) ?? emails[0]
  if (!chosen)
    throw new Error('the holder has no e-mail on file at the sede for notices')
  return chosen.wayvalue
}
