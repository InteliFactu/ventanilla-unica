import type { HttpClient } from '../../../http/types/HttpClient'
import { readAppointmentErrorId } from '../parsers/readAppointmentErrorId'
import { isAppointmentErrorPage } from '../validators/isAppointmentErrorPage'
import { validateAppointmentResponse } from '../validators/validateAppointmentResponse'
import { requestAppointmentPage } from './requestAppointmentPage'

/** Request an appointment step that must answer a regular page. */
export const fetchAppointmentPage = async (
  client: HttpClient,
  step: string,
  fields?: Readonly<Record<string, string>>,
): Promise<string> => {
  const response = await requestAppointmentPage(client, step, fields)
  if (isAppointmentErrorPage(response.text))
    throw new Error(
      `AEAT appointment step ${step} answered its internal error page (error ${readAppointmentErrorId(response.text) ?? 'unnumbered'})`,
    )
  validateAppointmentResponse(response)
  return response.text
}
