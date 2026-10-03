import type { HttpResponse } from '../../../http/types/HttpResponse'

/** A canned response for a fake client. */
export const respondWith = (
  url: string,
  content: string | Buffer,
  status = 200,
): HttpResponse => {
  const body = Buffer.isBuffer(content) ? content : Buffer.from(content)
  return { status, url, headers: {}, body, text: body.toString() }
}
