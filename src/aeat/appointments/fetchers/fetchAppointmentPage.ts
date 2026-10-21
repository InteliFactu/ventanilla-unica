import type { HttpClient } from '../../../http/types/HttpClient'
import { appointmentOrigin } from '../appointmentOrigin'

/** Request an observed appointment step, retaining the same client's cookies. */
export const fetchAppointmentPage = async (
  client: HttpClient,
  step: string,
  fields?: Readonly<Record<string, string>>,
): Promise<string> => {
  const response = await client.request(appointmentOrigin + step, {
    ...(fields === undefined ? {} : { method: 'POST', form: fields }),
    referer: appointmentOrigin + step,
  })
  if (response.status !== 200 || !response.text.includes('TOCP-MUTE'))
    throw new Error('AEAT appointment session or page unavailable')
  return response.text
}
