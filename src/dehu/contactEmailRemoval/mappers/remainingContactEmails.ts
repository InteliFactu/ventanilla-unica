import type { DehuEmailRemoval } from '../types/DehuEmailRemoval'
import { readContactSlots } from './readContactSlots'

/** The emails a contact body leaves, with `emailN_confirmacion === 1` read as confirmed, as `dehu contacto` reads them. */
export const remainingContactEmails = (
  body: Readonly<Record<string, unknown>>,
): DehuEmailRemoval['remaining'] =>
  readContactSlots(body).map((slot) => ({
    email: slot.email,
    confirmed: slot.status === 1,
  }))
