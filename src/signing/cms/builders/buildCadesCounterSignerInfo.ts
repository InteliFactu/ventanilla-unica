import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { DigestName } from '../../types/DigestName'
import { countersignatureAttributes } from '../countersignatureAttributes'
import { selectSignerInfoSignature } from '../selectors/selectSignerInfoSignature'
import { buildSignerInfo } from './buildSignerInfo'

/** Sign only the target SignerInfo's signature octets, as required by CMS. */
export const buildCadesCounterSignerInfo = (
  identity: CertificateIdentity,
  target: Buffer,
  digest: DigestName,
  signingTime: Date,
): Buffer => {
  const signatureDigest = createHash(digest)
    .update(selectSignerInfoSignature(target))
    .digest()
  return buildSignerInfo(identity, digest, (signer) =>
    countersignatureAttributes(signatureDigest, signer, {
      signingTime,
      digest,
    }),
  )
}
