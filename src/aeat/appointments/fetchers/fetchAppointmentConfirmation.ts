import type { HttpClient } from '../../../http/types/HttpClient'
import type { AppointmentSlot } from '../types/AppointmentSlot'
import { fetchAppointmentPage } from './fetchAppointmentPage'

/** Prepare the selected offered slot; the portal still requires final confirmation. */
export const fetchAppointmentConfirmation = async (
  client: HttpClient,
  slot: AppointmentSlot,
): Promise<string> => {
  const html = await fetchAppointmentPage(client, 'cita', {
    fcentro: slot.centre,
    fdia: slot.date,
    fhora: slot.start,
    fservicio: slot.service,
    faccion: 'V',
  })
  if (!html.includes('onSubmitConfirmaCita()') || !html.includes('femail1'))
    throw new Error('AEAT did not prepare the selected appointment')
  return html
}
