import type { HttpResponse } from '../../../http/types/HttpResponse'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** Require an authenticated holder page, not an HTTP-200 login or error page. */
export const validateYouthGuaranteePage = (
  page: HttpResponse,
): HttpResponse => {
  if (
    page.status !== 200 ||
    new URL(page.url).origin !== youthGuaranteeUrls.origin ||
    !/href=["'](?:\.\/|\/)?logout["']/i.test(page.text)
  )
    throw new Error(
      'Garantía Juvenil: no authenticated holder page; the session may have expired',
    )
  return page
}
