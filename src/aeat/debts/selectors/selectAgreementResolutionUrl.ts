import { readAgreementAnchorTargets } from '../parsers/readAgreementAnchorTargets'
import { readAgreementPortalUrl } from '../parsers/readAgreementPortalUrl'
import { isAgreementResolutionQuery } from '../validators/isAgreementResolutionQuery'

/** Select the single active read-only URL advertised for this resolution. */
export const selectAgreementResolutionUrl = (
  html: string,
  agreement: string,
  detailUrl: string,
): string => {
  const path = '/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccionW'
  const urls = new Map<string | null, string>()
  for (const target of readAgreementAnchorTargets(html)) {
    const url = readAgreementPortalUrl(target, path, detailUrl)
    if (url && isAgreementResolutionQuery(url.searchParams, agreement))
      urls.set(url.searchParams.get('fcerti'), url.href)
  }
  const [url] = urls.values()
  if (!url)
    throw new Error('AEAT: no resolution PDF is listed for this agreement')
  if (urls.size > 1)
    throw new Error(
      'AEAT: multiple resolution PDFs are listed for this agreement',
    )
  return url
}
