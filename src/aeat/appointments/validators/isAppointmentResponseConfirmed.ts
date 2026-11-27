import type { HttpResponse } from '../../../http/types/HttpResponse'
import { appointmentOrigin } from '../appointmentOrigin'
import type { AppointmentQuery } from '../types/AppointmentQuery'
import type { AppointmentSlot } from '../types/AppointmentSlot'
import { isAppointmentReceiptConfirmed } from './isAppointmentReceiptConfirmed'

/** Only the final successful response from the reservation endpoint can confirm a booking. */
export const isAppointmentResponseConfirmed = (
  response: HttpResponse,
  query: AppointmentQuery,
  slot: AppointmentSlot,
): boolean =>
  response.status === 200 &&
  response.url === `${appointmentOrigin}confirmacion` &&
  isAppointmentReceiptConfirmed(response.text, query, slot)
