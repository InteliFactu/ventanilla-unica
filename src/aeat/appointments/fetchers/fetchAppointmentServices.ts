import type { HttpClient } from '../../../http/types/HttpClient'
import type { AppointmentQuery } from '../types/AppointmentQuery'
import { fetchAppointmentPage } from './fetchAppointmentPage'

/** Identify the holder without booking or accepting a notification. */
export const fetchAppointmentServices = async (
  client: HttpClient,
  query: AppointmentQuery,
): Promise<string> => {
  await fetchAppointmentPage(client, 'identificacion')
  return fetchAppointmentPage(client, 'identificacion', {
    fnif: query.nif,
    fnombre: query.name,
    fnifR: '',
    fnombreR: '',
    fnombreSN: '',
    USUARIO: '',
    citaSNif: 'N',
    modoCita: '1',
    simularGest: 'N',
    simularCBPT: 'N',
    faccion: 'V',
  })
}
