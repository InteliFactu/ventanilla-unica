import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchUploaderSession } from './fetchers/fetchUploaderSession'
import { signRelecDocument } from './fetchers/signRelecDocument'
import { uploadRelecDocument } from './fetchers/uploadRelecDocument'
import type { RelecUploadTarget } from './types/RelecUploadTarget'

/**
 * Attach and sign every document in its row, in order, as the popup does for
 * each "Adjuntar y firmar": open the popup, upload, then download, sign and
 * re-upload. Nothing is registered by this.
 */
export const uploadRelecDocuments = async (
  client: HttpClient,
  targets: readonly RelecUploadTarget[],
  identity: CertificateIdentity,
): Promise<void> => {
  for (const target of targets) {
    const session = await fetchUploaderSession(client, target)
    await uploadRelecDocument(client, target, session)
    await signRelecDocument(client, target, identity)
  }
}
