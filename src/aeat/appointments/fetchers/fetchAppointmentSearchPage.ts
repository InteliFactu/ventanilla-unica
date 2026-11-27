import type { HttpClient } from '../../../http/types/HttpClient'
import { isAppointmentErrorPage } from '../validators/isAppointmentErrorPage'
import { validateAppointmentResponse } from '../validators/validateAppointmentResponse'
import { requestAppointmentPage } from './requestAppointmentPage'

/**
 * Keep the recognized AEAT error page so the search can report the incident.
 */
export const fetchAppointmentSearchPage = async (
  client: HttpClient,
  step: string,
  fields: Readonly<Record<string, string>>,
): Promise<string> => {
  const response = await requestAppointmentPage(client, step, fields)
  if (
    (response.status === 200 || response.status === 299) &&
    isAppointmentErrorPage(response.text)
  )
    return response.text
  validateAppointmentResponse(response)
  return response.text
}
