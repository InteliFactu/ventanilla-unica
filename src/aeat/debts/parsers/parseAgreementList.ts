import { aeatBaseUrl } from '../../session/aeatBaseUrl'
import type { AgreementListing } from '../types/AgreementListing'
import { readAgreementAnchorTargets } from './readAgreementAnchorTargets'
import { readAgreementDetailCode } from './readAgreementDetailCode'
import { readAgreementPortalUrl } from './readAgreementPortalUrl'

/**
 * Every agreement (`cacuerdo=`) linked from the SRAF request listing,
 * deduplicated by code (each row links to it twice: cell text and 'Ventana').
 */
export const parseAgreementList = (
  html: string,
  baseUrl: string,
): readonly AgreementListing[] => {
  if (baseUrl !== aeatBaseUrl) return []
  const path = '/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta'
  const seen = new Set<string>()
  const listings: AgreementListing[] = []
  for (const target of readAgreementAnchorTargets(html)) {
    const url = readAgreementPortalUrl(target, path)
    if (!url) continue
    const acuerdo = readAgreementDetailCode(url.searchParams)
    if (!acuerdo || seen.has(acuerdo)) continue
    seen.add(acuerdo)
    listings.push({
      acuerdo,
      detailUrl: url.href,
    })
  }
  return listings
}
