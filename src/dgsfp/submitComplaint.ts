import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { HttpClient } from '../http/types/HttpClient'
import { signPdf } from '../signing/pades/signPdf'
import { certificateDerBase64 } from '../tgss/signing/certificateDerBase64'
import { buildRegisterRequest } from './builders/buildRegisterRequest'
import { checkAttachment } from './fetchers/checkAttachment'
import { registerComplaint } from './fetchers/registerComplaint'
import { saveDraft } from './fetchers/saveDraft'
import { uploadAttachment } from './fetchers/uploadAttachment'
import type { DgsfpPreparedComplaint } from './types/DgsfpPreparedComplaint'
import type { DgsfpRegisterAnswer } from './types/DgsfpRegisterAnswer'

/**
 * The writing half, in the page's order: upload every PDF, have the sede
 * confirm it holds each, save the draft ("Revisar y presentar"), sign the
 * request document locally where the page calls AutoFirma (PAdES,
 * SHA256withRSA, visible), and register.
 */
export const submitComplaint = async (
  client: HttpClient,
  prepared: DgsfpPreparedComplaint,
  identity: CertificateIdentity,
): Promise<DgsfpRegisterAnswer> => {
  const { digest } = prepared.session
  for (const file of prepared.files)
    await uploadAttachment(client, prepared.numTelematico, file)
  for (const file of prepared.files)
    await checkAttachment(client, digest, prepared.numTelematico, file)
  await saveDraft(client, digest, prepared)
  const signedDocument = signPdf(identity, prepared.document, {
    visible: true,
  })
  return registerComplaint(
    client,
    digest,
    buildRegisterRequest(prepared.values, prepared.datosFormulario, {
      numTelematico: prepared.numTelematico,
      document: prepared.document,
      signedDocument,
      certificateDerBase64: certificateDerBase64(identity),
    }),
  )
}
