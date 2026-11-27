import type { HttpResponse } from '../../../http/types/HttpResponse'

/** Refuse failed requests and pages outside the appointment service (a login, say). */
export const validateAppointmentResponse = (response: HttpResponse): void => {
  if (response.status !== 200 || !response.text.includes('TOCP-MUTE'))
    throw new Error('AEAT appointment session or page unavailable')
}
