import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { appointmentManagementUrl } from '../appointmentManagementUrl'
import type { AppointmentBooking } from '../types/AppointmentBooking'
import { requestAppointmentPage } from './requestAppointmentPage'

/** Final booking request; called only after the explicit confirmation guard. */
export const submitAppointment = async (
  client: HttpClient,
  booking: AppointmentBooking,
): Promise<HttpResponse> => {
  try {
    return await requestAppointmentPage(
      client,
      'confirmacion',
      {
        fpre1: '34',
        ftel1: booking.phone,
        fpre2: '34',
        ftel2: booking.phone,
        femail1: booking.email,
        femail2: booking.email,
        fidi1: '',
        fidi2: '',
        fdetalle: booking.detail,
        fpresente: '',
        faccion: 'V',
      },
      false,
    )
  } catch (cause) {
    throw new Error(
      `AEAT returned no booking receipt. Check the appointment status before retrying: ${appointmentManagementUrl}`,
      { cause },
    )
  }
}
