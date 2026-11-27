import type { HttpClient } from '../../http/types/HttpClient'
import { aeatBaseUrl } from '../session/aeatBaseUrl'
import { openAeatSession } from '../session/openAeatSession'
import { parseAgreementList } from './parsers/parseAgreementList'
import { selectAgreementResolutionUrl } from './selectors/selectAgreementResolutionUrl'
import { agreementListingUrl } from './urls/agreementListingUrl'

/** Read the original resolution PDF of one agreement listed for the certificate holder. */
export const readAeatAgreementResolution = async (
  client: HttpClient,
  agreement: string,
): Promise<Buffer> => {
  if (!/^\d{12}[A-Z]$/.test(agreement))
    throw new Error(
      'AEAT: expected a 12-digit agreement code followed by a letter',
    )
  await openAeatSession(client)
  const noRedirects = { followRedirects: false }
  const listing = await client.request(agreementListingUrl, noRedirects)
  if (listing.status !== 200)
    throw new Error('AEAT: the agreement list was not available')
  const selected = parseAgreementList(listing.text, aeatBaseUrl).find(
    ({ acuerdo }) => acuerdo === agreement,
  )
  if (!selected)
    throw new Error(
      'AEAT: the agreement is not listed for the certificate holder',
    )
  const detail = await client.request(selected.detailUrl, noRedirects)
  if (detail.status !== 200)
    throw new Error('AEAT: the listed agreement detail was not available')
  const url = selectAgreementResolutionUrl(
    detail.text,
    agreement,
    selected.detailUrl,
  )
  const pdf = await client.request(url, noRedirects)
  if (
    pdf.status !== 200 ||
    !pdf.body.subarray(0, 5).equals(Buffer.from('%PDF-'))
  )
    throw new Error('AEAT: no PDF returned for the agreement resolution')
  return pdf.body
}
