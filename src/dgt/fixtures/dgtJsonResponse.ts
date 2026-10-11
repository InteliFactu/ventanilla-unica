import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'

/** A synthetic sede JSP answer carrying a JSON body. */
export const dgtJsonResponse = (url: string, body: unknown): HttpResponse =>
  htmlResponse(url, JSON.stringify(body))
