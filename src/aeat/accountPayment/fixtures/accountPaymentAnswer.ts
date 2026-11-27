import type { HttpResponse } from '../../../http/types/HttpResponse'

/** A synthetic portal response carrying `text`. */
export const accountPaymentAnswer = (
  text: string,
  status = 200,
): HttpResponse => ({
  status,
  url: '',
  headers: {},
  body: Buffer.from(text),
  text,
})
