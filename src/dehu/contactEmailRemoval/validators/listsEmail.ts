import { readContactSlots } from '../mappers/readContactSlots'

/** True when any of a contact record's `email1..email5` is `email`, ignoring case. */
export const listsEmail = (contact: unknown, email: string): boolean =>
  readContactSlots(contact).some(
    (slot) => slot.email.toLowerCase() === email.toLowerCase(),
  )
