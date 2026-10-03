import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchFilingPdf } from '../../filings/fetchers/fetchFilingPdf'
import { parseCsvCode } from '../../filings/parsers/parseCsvCode'
import { encodeLatin1Form } from '../mappers/encodeLatin1Form'
import { withSignatureFields } from '../mappers/withSignatureFields'
import { parseConfirmationFormFields } from '../parsers/parseConfirmationFormFields'
import { parseIslwToken } from '../parsers/parseIslwToken'
import { readMainText } from '../parsers/readMainText'
import type { EmceCertificate } from '../types/EmceCertificate'
import type { EmceSigner } from '../types/EmceSigner'
import type { FormFieldPair } from '../types/FormFieldPair'
import { fetchEmceEntryPage } from './fetchEmceEntryPage'
import { postEmceForm } from './postEmceForm'

/**
 * The request every EMCE-JDIT certificate servlet runs: read the `fIslw`
 * token, validate the request (fAccion=2), confirm it with the "firma
 * básica" fields the signer names, and exchange the CSV of the receipt for
 * the PDF. The session must already be open.
 */
export const fetchEmceCertificate = async (
  client: HttpClient,
  servlet: string,
  validation: (islw: string) => readonly FormFieldPair[],
  signer: EmceSigner,
): Promise<EmceCertificate> => {
  const islw = parseIslwToken(await fetchEmceEntryPage(client, servlet))
  if (islw === undefined)
    throw new Error(
      'AEAT: no fIslw token, the certificate did not authenticate',
    )
  const confirmation = await postEmceForm(
    client,
    servlet,
    encodeLatin1Form(validation(islw)),
  )
  const signedBy = signer(confirmation)
  const signed = withSignatureFields(
    parseConfirmationFormFields(confirmation),
    signedBy,
  )
  const receipt = await postEmceForm(client, servlet, encodeLatin1Form(signed))
  const csv = parseCsvCode(receipt)
  if (csv === undefined)
    throw new Error(
      `AEAT: the signed request came back without a CSV: ${readMainText(receipt).slice(0, 400)}`,
    )
  return { csv, pdf: await fetchFilingPdf(client, csv), signedBy }
}
