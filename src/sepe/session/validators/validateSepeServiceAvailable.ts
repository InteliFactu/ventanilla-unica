import type { HttpResponse } from '../../../http/types/HttpResponse'
import { readSepeOutage } from '../parsers/readSepeOutage'

/**
 * Pass the landed service page through, or fail with the outage the sede
 * reported, so a maintenance window reads as one instead of as a missing form
 * further down.
 */
export const validateSepeServiceAvailable = (
  page: HttpResponse,
): HttpResponse => {
  const outage = readSepeOutage(page.url, page.text)
  if (outage === undefined) return page
  throw new Error(
    `SEPE: the sede answered "${outage}" after login at ${page.url}; it is the sede's maintenance answer, retry later`,
  )
}
