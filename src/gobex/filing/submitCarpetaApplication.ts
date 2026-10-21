import { join } from 'node:path'
import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { advanceCarpetaPage } from './fetchers/advanceCarpetaPage'
import { fetchDraftPreview } from './fetchers/fetchDraftPreview'
import { postCarpetaSignature } from './fetchers/postCarpetaSignature'
import { signCarpetaHash } from './mappers/signCarpetaHash'
import { readCarpetaFilingError } from './parsers/readCarpetaFilingError'
import { readCarpetaForm } from './parsers/readCarpetaForm'
import { readCarpetaRegistration } from './parsers/readCarpetaRegistration'
import { selectSigningConfirmation } from './selectors/selectSigningConfirmation'
import { writeCarpetaEvidence } from './writers/writeCarpetaEvidence'

/** Sign a live, prepared application in its own authenticated session, exactly once. */
export const submitCarpetaApplication = async (
  client: HttpClient,
  identity: CertificateIdentity,
  page: HttpResponse,
  outDir: string,
): Promise<unknown> => {
  const form = readCarpetaForm(page.text, page.url, 'f_solicitud')
  const draft = form.fields['f_solicitud:rue'] ?? ''
  const sha256 = await fetchDraftPreview(client, draft, outDir)
  await writeCarpetaEvidence(outDir, `${draft}-before-signing.html`, page.text)
  const prepared = await advanceCarpetaPage(client, page, {
    form: 'f_solicitud',
    image: 'bt_firmaryregistrar_on',
  })
  const ready = readCarpetaForm(prepared.text, prepared.url, 'f_solicitud')
  const signed = await signCarpetaHash(
    identity,
    ready.fields['f_solicitud:hash'] ?? '',
  )
  const response = await postCarpetaSignature(
    client,
    ready,
    signed,
    selectSigningConfirmation(prepared.text),
  )
  await writeCarpetaEvidence(
    outDir,
    `${draft}-after-signing.html`,
    response.text,
  )
  return {
    draft,
    sha256,
    status: response.status,
    response: join(outDir, `${draft}-after-signing.html`),
    registration: readCarpetaRegistration(response.text),
    registered: readCarpetaRegistration(response.text) !== undefined,
    error: readCarpetaFilingError(response.text),
  }
}
