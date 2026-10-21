import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAppointmentOffers } from './fetchers/fetchAppointmentOffers'
import { parseAppointmentSlots } from './parsers/parseAppointmentSlots'
import type { AppointmentQuery } from './types/AppointmentQuery'
import type { AppointmentSlot } from './types/AppointmentSlot'

/** List appointments without performing the final reservation. */
export const listAppointments = async (
  client: HttpClient,
  query: AppointmentQuery,
): Promise<AppointmentSlot[]> =>
  parseAppointmentSlots(await fetchAppointmentOffers(client, query))
