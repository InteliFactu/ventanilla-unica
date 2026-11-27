import type { HttpClient } from '../../../http/types/HttpClient'
import { appointmentSearchTime } from '../mappers/appointmentSearchTime'
import type { AppointmentQuery } from '../types/AppointmentQuery'
import { isAppointmentErrorPage } from '../validators/isAppointmentErrorPage'
import { fetchAppointmentSearchPage } from './fetchAppointmentSearchPage'
import { fetchAppointmentServices } from './fetchAppointmentServices'

/**
 * Search in-person appointments only, using a postal code to avoid charset
 * ambiguity. An error page at `procedimiento` is returned without the `cita`
 * step: the portal answered that way for a holder who already had a booking.
 */
export const fetchAppointmentOffers = async (
  client: HttpClient,
  query: AppointmentQuery,
): Promise<string> => {
  const services = await fetchAppointmentServices(client, query)
  if (!services.includes(`'valueProcedimiento':'${query.service}'`))
    throw new Error('AEAT did not offer the requested appointment service')
  const procedure = await fetchAppointmentSearchPage(client, 'procedimiento', {
    faccion: 'V',
    fmodoParaQue: 'SERVICIOS',
    fcsv: '',
    fsrv: query.service,
    fcatalogo: '',
  })
  if (isAppointmentErrorPage(procedure)) return procedure
  return fetchAppointmentSearchPage(client, 'cita', {
    filpre: 'S',
    filtel: 'N',
    filvid: 'N',
    filinm: 'N',
    filcsv: 'N',
    fmananas: 'S',
    ftardes: 'S',
    fDesde: query.date,
    hDesde: appointmentSearchTime(query.time),
    fpropos: query.postalCode,
    filpmr: 'N',
    filpls: 'N',
    fgeopre: '',
    fgeoace: '',
  })
}
