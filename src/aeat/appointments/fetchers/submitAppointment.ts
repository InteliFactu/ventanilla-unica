import type { HttpClient } from '../../../http/types/HttpClient'
import type { AppointmentBooking } from '../types/AppointmentBooking'
import { fetchAppointmentPage } from './fetchAppointmentPage'

/** Final booking request; called only after the explicit confirmation guard. */
export const submitAppointment = async (
  client: HttpClient,
  booking: AppointmentBooking,
): Promise<string> =>
  fetchAppointmentPage(client, 'confirmacion', {
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
  })
