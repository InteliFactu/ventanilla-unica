import { asRecord } from '../../api/asRecord'
import { contactSlotFields } from './contactSlotFields'
import { readContactSlots } from './readContactSlots'

/**
 * The PUT body the DEHU front sends when an email is deleted on "Datos de
 * contacto y avisos" (its `ContactMapper.mapTo`): the flat `email1..email5`
 * record, the remaining emails compacted into the first slots with their own
 * `emailN_confirmacion`, the phone, the schedule, the push devices and the id
 * of the contact legal text in force. Fails when the email is not there or
 * when nothing would be left to notify.
 */
export const contactWithoutEmail = (
  current: unknown,
  email: string,
  legalTextId: string,
): Record<string, unknown> => {
  const record = asRecord(current) ?? {}
  const present = readContactSlots(record)
  const kept = present.filter(
    (slot) => slot.email.toLowerCase() !== email.toLowerCase(),
  )
  if (kept.length === present.length)
    throw new Error(`DEHU: ${email} is not among the contact emails`)
  const push = Array.isArray(record['contactoPush'])
    ? record['contactoPush']
    : []
  if (kept.length === 0 && push.length === 0)
    throw new Error(
      'DEHU: removing the only contact would leave no notice channel',
    )
  return {
    nif: record['nif'],
    telefono: record['telefono'] ?? null,
    noticeTime: record['noticeTime'] ?? null,
    legalTextId: Number(legalTextId),
    contactoPush: push,
    ...contactSlotFields(kept),
  }
}
