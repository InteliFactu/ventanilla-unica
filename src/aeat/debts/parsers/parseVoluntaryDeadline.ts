import { htmlToText } from '../../../html/htmlToText'
import { parseAgreementDueDate } from './parseAgreementDueDate'
import { stripInactiveAgreementMarkup } from './stripInactiveAgreementMarkup'

/** Read only the explicit voluntary-payment deadline from visible debt detail. */
export const parseVoluntaryDeadline = (html: string): string | undefined => {
  const text = htmlToText(stripInactiveAgreementMarkup(html))
  const dates = new Set(
    Array.from(
      text.matchAll(
        /(?:^|\s)Fecha l[ií]mite ingreso en voluntaria(?:\s*:\s*|\s+)(\d{2}-\d{2}-\d{4})(?=\s|$)/gi,
      ),
      (match) => match[1],
    ),
  )
  const [date] = dates
  return dates.size === 1 && date ? parseAgreementDueDate(date) : undefined
}
