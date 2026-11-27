import { isSpanishDate } from '../../../dates/isSpanishDate'
import type { YouthGuaranteeStatus } from '../types/YouthGuaranteeStatus'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** Read the date carried by the authenticated beneficiary landing route. */
export const readYouthGuaranteeLandingDate = (
  pageUrl: string,
  state: YouthGuaranteeStatus['state'],
): string | null => {
  if (state !== 'alta' || !URL.canParse(pageUrl)) return null
  const url = new URL(pageUrl)
  if (
    url.origin !== youthGuaranteeUrls.origin ||
    url.pathname !== '/solicitudActiva.action' ||
    url.username ||
    url.password
  )
    return null
  const dates = url.searchParams.getAll('fechaEstadoInscripcion')
  const [date] = dates
  return dates.length === 1 && date && isSpanishDate(date) ? date : null
}
