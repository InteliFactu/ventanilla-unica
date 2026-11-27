import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAppointmentOffers } from './fetchers/fetchAppointmentOffers'
import { appointmentSearchRefusal } from './mappers/appointmentSearchRefusal'
import { parseAppointmentSlots } from './parsers/parseAppointmentSlots'
import type { AppointmentQuery } from './types/AppointmentQuery'
import type { AppointmentSearch } from './types/AppointmentSearch'
import { isAppointmentErrorPage } from './validators/isAppointmentErrorPage'

/** Search offers or report the portal's error and appointment-management link. */
export const searchAppointments = async (
  client: HttpClient,
  query: AppointmentQuery,
): Promise<AppointmentSearch> => {
  const html = await fetchAppointmentOffers(client, query)
  if (isAppointmentErrorPage(html))
    return { slots: [], refusal: appointmentSearchRefusal(html) }
  return { slots: parseAppointmentSlots(html) }
}
