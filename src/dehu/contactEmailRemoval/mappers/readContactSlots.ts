import { asRecord } from '../../api/asRecord'
import type { DehuContactSlot } from '../types/DehuContactSlot'

/** The filled `email1..email5` slots of a DEHU contact record, in slot order. */
export const readContactSlots = (contact: unknown): DehuContactSlot[] => {
  const record = asRecord(contact) ?? {}
  return [1, 2, 3, 4, 5].flatMap((slot) => {
    const email = record[`email${String(slot)}`]
    return typeof email === 'string' && email !== ''
      ? [{ email, status: record[`email${String(slot)}_confirmacion`] }]
      : []
  })
}
