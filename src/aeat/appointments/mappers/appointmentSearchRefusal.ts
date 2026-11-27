import { appointmentManagementUrl } from '../appointmentManagementUrl'
import { readAppointmentErrorId } from '../parsers/readAppointmentErrorId'
import type { AppointmentSearchRefusal } from '../types/AppointmentSearchRefusal'

/** Describe the error page a search hit, pointing at the holder's existing appointments. */
export const appointmentSearchRefusal = (
  html: string,
): AppointmentSearchRefusal => {
  const errorId = readAppointmentErrorId(html)
  return {
    reason:
      'AEAT answered "Se ha producido un error interno en el Sistema" during the search, as it did for a holder who already had an appointment for this service; review it at the management page',
    ...(errorId === undefined ? {} : { errorId }),
    manageUrl: appointmentManagementUrl,
  }
}
