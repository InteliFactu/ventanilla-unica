import type { HttpResponse } from '../../../http/types/HttpResponse'

/** Synthetic appointment response. */
export const appointmentResponse = (
  text: string,
  status = 200,
): HttpResponse => ({
  status,
  url: 'https://www2.agenciatributaria.gob.es/wlpl/TOCP-MUTE/internet/cita',
  headers: {},
  text: 'TOCP-MUTE ' + text,
  body: Buffer.from(text),
})
