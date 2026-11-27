import { isAgreementCalendarQuery } from '../validators/isAgreementCalendarQuery'
import { readAgreementAnchorTargets } from './readAgreementAnchorTargets'
import { readAgreementPortalUrl } from './readAgreementPortalUrl'

/** Read the opaque identifiers from the detail links without deriving them from debt keys. */
export const parseAgreementCalendarUrls = (
  html: string,
  agreement: string,
): readonly string[] => {
  const path = '/wlpl/inwinvoc/es.aeat.dit.adu.sraf.vtosaplaz.VtapAccDeta'
  const urls = new Set<string>()
  for (const target of readAgreementAnchorTargets(html)) {
    const url = readAgreementPortalUrl(target, path)
    if (url && isAgreementCalendarQuery(url.searchParams, agreement))
      urls.add(url.href)
  }
  return Array.from(urls)
}
