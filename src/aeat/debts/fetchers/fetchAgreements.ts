import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'
import { parseAgreementDetail } from '../parsers/parseAgreementDetail'
import { parseAgreementList } from '../parsers/parseAgreementList'
import type { Agreement } from '../types/Agreement'
import { agreementListingUrl } from '../urls/agreementListingUrl'
import { fetchAgreementCalendar } from './fetchAgreementCalendar'

/** Every SRAF deferral/instalment agreement on the certificate's NIF, read-only. */
export const fetchAgreements = async (
  client: HttpClient,
): Promise<readonly Agreement[]> => {
  const listingResponse = await client.request(agreementListingUrl)
  const listings = parseAgreementList(listingResponse.text, aeatBaseUrl)
  const agreements: Agreement[] = []
  for (const listing of listings) {
    const detailResponse = await client.request(listing.detailUrl, {
      followRedirects: false,
    })
    const detail = parseAgreementDetail(
      detailResponse.status === 200 ? detailResponse.text : '',
    )
    const calendar =
      detailResponse.status === 200
        ? await fetchAgreementCalendar(
            client,
            detailResponse.text,
            listing.acuerdo,
            detail.deudas,
          )
        : {}
    agreements.push({
      acuerdo: listing.acuerdo,
      ...detail,
      ...calendar,
    })
  }
  return agreements
}
