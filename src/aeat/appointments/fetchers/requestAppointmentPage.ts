import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { appointmentOrigin } from '../appointmentOrigin'

/** Request an observed appointment step, retaining the same client's cookies. */
export const requestAppointmentPage = async (
  client: HttpClient,
  step: string,
  fields?: Readonly<Record<string, string>>,
  followRedirects?: boolean,
): Promise<HttpResponse> =>
  client.request(appointmentOrigin + step, {
    ...(fields === undefined ? {} : { method: 'POST', form: fields }),
    referer: appointmentOrigin + step,
    ...(followRedirects === undefined ? {} : { followRedirects }),
  })
