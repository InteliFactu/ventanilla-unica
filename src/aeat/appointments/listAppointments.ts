import type { HttpClient } from '../../http/types/HttpClient'
import { searchAppointments } from './searchAppointments'
import type { AppointmentQuery } from './types/AppointmentQuery'
import type { AppointmentSlot } from './types/AppointmentSlot'

/** List appointments without performing the final reservation; a refused search throws. */
export const listAppointments = async (
  client: HttpClient,
  query: AppointmentQuery,
): Promise<AppointmentSlot[]> => {
  const { slots, refusal } = await searchAppointments(client, query)
  if (refusal) throw new Error(`${refusal.reason}: ${refusal.manageUrl}`)
  return slots
}
