import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAppointmentConfirmation } from './fetchers/fetchAppointmentConfirmation'
import { submitAppointment } from './fetchers/submitAppointment'
import { listAppointments } from './listAppointments'
import type { AppointmentBooking } from './types/AppointmentBooking'
import type { AppointmentBookingResult } from './types/AppointmentBookingResult'
import type { AppointmentQuery } from './types/AppointmentQuery'
import { validateAppointmentConfirmation } from './validators/validateAppointmentConfirmation'
import { validateAppointmentContact } from './validators/validateAppointmentContact'

/**
 * Recheck the exact offer and reserve it only when explicitly confirmed. A plan
 * stops after the offer list: preparing the slot (the `cita` step with `fhora`)
 * already holds it at the AEAT as pending confirmation.
 */
export const bookAppointment = async (
  client: HttpClient,
  query: AppointmentQuery,
  booking: AppointmentBooking,
): Promise<AppointmentBookingResult> => {
  if (booking.confirm) validateAppointmentContact(booking)
  const offered = await listAppointments(client, query)
  const selected = offered.find(
    (slot) =>
      slot.centre === booking.slot.centre &&
      slot.date === booking.slot.date &&
      slot.start === booking.slot.start &&
      slot.service === booking.slot.service &&
      slot.kind === 'P',
  )
  if (!selected)
    throw new Error('The exact in-person appointment is no longer offered')
  if (!booking.confirm) return { executed: false }
  const confirmation = await fetchAppointmentConfirmation(client, selected)
  validateAppointmentConfirmation(confirmation, query, selected)
  return { executed: true, html: await submitAppointment(client, booking) }
}
