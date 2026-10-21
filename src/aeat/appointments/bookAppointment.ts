import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAppointmentConfirmation } from './fetchers/fetchAppointmentConfirmation'
import { submitAppointment } from './fetchers/submitAppointment'
import { listAppointments } from './listAppointments'
import type { AppointmentBooking } from './types/AppointmentBooking'
import type { AppointmentBookingResult } from './types/AppointmentBookingResult'
import type { AppointmentQuery } from './types/AppointmentQuery'
import { validateAppointmentConfirmation } from './validators/validateAppointmentConfirmation'

/** Recheck the exact offer and refuse the final reservation unless explicitly confirmed. */
export const bookAppointment = async (
  client: HttpClient,
  query: AppointmentQuery,
  booking: AppointmentBooking,
): Promise<AppointmentBookingResult> => {
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
  const confirmation = await fetchAppointmentConfirmation(client, selected)
  validateAppointmentConfirmation(confirmation, query, selected)
  if (!booking.confirm) return { executed: false }
  if (
    !booking.email.includes('@') ||
    !/^\d{9,15}$/u.test(booking.phone) ||
    booking.detail.length > 250
  )
    throw new Error(
      'Booking requires valid contact details and at most 250 detail characters',
    )
  return { executed: true, html: await submitAppointment(client, booking) }
}
