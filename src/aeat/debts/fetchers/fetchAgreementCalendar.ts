import type { HttpClient } from '../../../http/types/HttpClient'
import { parseAgreementCalendar } from '../parsers/parseAgreementCalendar'
import { parseAgreementCalendarUrls } from '../parsers/parseAgreementCalendarUrls'
import type { Agreement } from '../types/Agreement'
import type { AgreementInstalment } from '../types/AgreementInstalment'

/** Fetch only advertised calendar reads. SRAF repeats some rows, so keep the last row for each debt and instalment. */
export const fetchAgreementCalendar = async (
  client: HttpClient,
  detail: string,
  agreement: string,
  debtKeys: readonly string[],
): Promise<
  Pick<Agreement, 'currentInstalments' | 'currentInstalmentsNote'>
> => {
  try {
    const urls = parseAgreementCalendarUrls(detail, agreement)
    if (urls.length === 0) return {}
    if (debtKeys.length === 0)
      throw new Error('AEAT agreement lists no verifiable debt keys')
    const instalments = new Map<string, AgreementInstalment>()
    for (const url of urls) {
      const response = await client.request(url, {
        followRedirects: false,
        defaultCharset: 'iso-8859-15',
      })
      if (response.status !== 200)
        throw new Error('Unexpected AEAT calendar status')
      for (const row of parseAgreementCalendar(response.text)) {
        if (!debtKeys.includes(row.debtKey))
          throw new Error('AEAT calendar row does not belong to the agreement')
        instalments.set(`${row.debtKey}/${String(row.number)}`, row)
      }
    }
    return { currentInstalments: Array.from(instalments.values()) }
  } catch {
    return {
      currentInstalmentsNote:
        'AEAT: the current instalment calendar could not be verified',
    }
  }
}
