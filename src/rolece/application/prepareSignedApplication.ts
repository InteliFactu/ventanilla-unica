import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchSigningScreen } from '../fetchers/fetchSigningScreen'
import { readSigningScreen } from '../parsers/readSigningScreen'
import { signApplicationDocument } from '../signing/signApplicationDocument'
import type { PreparedApplication } from '../types/PreparedApplication'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import { assertApplicationDocument } from '../validators/assertApplicationDocument'
import { assertSignerRepresents } from '../validators/assertSignerRepresents'
import { readSimplifiedApplication } from './readSimplifiedApplication'

/**
 * Walk to the draft to sign and sign it locally: the read-only screens,
 * "Firmar y Enviar Solicitud" (which answers the unsigned draft and files
 * nothing), the checks that the draft is this operator's and that the
 * certificate represents it, and the AutoFirma-equivalent signature.
 */
export const prepareSignedApplication = async (
  client: HttpClient,
  identity: CertificateIdentity,
  query: RegistrationQuery,
): Promise<PreparedApplication> => {
  const application = await readSimplifiedApplication(client, query)
  const page = await fetchSigningScreen(
    client,
    application.action,
    application.fields,
  )
  const screen = readSigningScreen(page)
  assertApplicationDocument(
    screen,
    query,
    application.fields['provinciaSimpli'] ?? '',
  )
  const signed = signApplicationDocument(identity, screen.document)
  assertSignerRepresents(screen.document, signed.signer, query.nif)
  return { application, screen, signed }
}
