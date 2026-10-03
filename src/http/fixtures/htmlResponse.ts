import type { HttpResponse } from '../types/HttpResponse'

/** A synthetic 200 answer with an HTML body, for tests that script a portal. */
export const htmlResponse = (url: string, text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.from(text),
  text,
})
