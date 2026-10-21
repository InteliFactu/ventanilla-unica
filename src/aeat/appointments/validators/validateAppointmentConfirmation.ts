import { htmlToText } from '../../../html/htmlToText'
import { formatAppointmentDate } from '../formatters/formatAppointmentDate'
import type { AppointmentQuery } from '../types/AppointmentQuery'
import type { AppointmentSlot } from '../types/AppointmentSlot'

/** Refuse echoed or stale server state before the final booking request. */
export const validateAppointmentConfirmation = (
  html: string,
  query: AppointmentQuery,
  slot: AppointmentSlot,
): void => {
  const text = htmlToText(html)
  const time = `${slot.start.slice(0, 2)}:${slot.start.slice(2)}`
  if (
    !text.includes(query.nif) ||
    !text.includes(formatAppointmentDate(slot.date)) ||
    !text.includes(`a las ${time}`) ||
    !text.includes(slot.address)
  )
    throw new Error(
      'AEAT confirmation does not match the holder, date, time and address',
    )
}
