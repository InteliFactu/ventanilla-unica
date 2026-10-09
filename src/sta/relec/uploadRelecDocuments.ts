import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchUploaderSession } from './fetchers/fetchUploaderSession'
import { signRelecDocument } from './fetchers/signRelecDocument'
import { uploadRelecDocument } from './fetchers/uploadRelecDocument'
import { selectDocumentType } from './selectors/selectDocumentType'
import type { RelecPreparation } from './types/RelecPreparation'

/**
 * Attach and sign every document in its row, in order, as the popup does for
 * each "Adjuntar y firmar": open the popup, upload, then download, sign and
 * re-upload. Nothing is registered by this.
 */
export const uploadRelecDocuments = async (
  client: HttpClient,
  prepared: RelecPreparation,
  identity: CertificateIdentity,
): Promise<void> => {
  const { origin, plan, types } = prepared
  for (const [slot, document] of plan.documents.entries()) {
    const target = {
      origin,
      slot,
      person: plan.represented.dboid,
      document,
      type: selectDocumentType(types, document.typeCode),
    }
    const session = await fetchUploaderSession(client, target)
    await uploadRelecDocument(client, target, session)
    await signRelecDocument(client, target, identity)
  }
}
