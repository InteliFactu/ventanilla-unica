import type { HttpClient } from '../../http/types/HttpClient'
import { documentFilingUrls } from './documentFilingUrls'
import { postRegistryForm } from './fetchers/postRegistryForm'
import { signatureScreenFields } from './mappers/signatureScreenFields'
import { parseSignatureScreen } from './parsers/parseSignatureScreen'
import { readFormFields } from './parsers/readFormFields'
import type { AeatPage } from './types/AeatPage'
import type { DocumentFilingQuery } from './types/DocumentFilingQuery'
import type { SignatureScreen } from './types/SignatureScreen'

/** Step 2, "Firma y envío": showing it is not the act; it lists what the signature would file. */
export const fetchSignatureScreen = async (
  client: HttpClient,
  page: AeatPage,
  query: DocumentFilingQuery,
): Promise<SignatureScreen> =>
  parseSignatureScreen(
    await postRegistryForm(
      client,
      documentFilingUrls.form,
      signatureScreenFields(
        readFormFields(page.html, 'Form'),
        readFormFields(page.html, 'Form2'),
        query,
      ),
      page.url,
    ),
  )
