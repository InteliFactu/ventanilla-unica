import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildSignerInfo } from './builders/buildSignerInfo'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { countersignatureAttributes } from './countersignatureAttributes'
import { withDigestAlgorithm } from './mappers/withDigestAlgorithm'
import { readSignedDataParts } from './parsers/readSignedDataParts'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import { selectSignerInfoSignature } from './selectors/selectSignerInfoSignature'
import type { CadesCountersignOptions } from './types/CadesCountersignOptions'
import { addUnsignedAttribute } from './writers/addUnsignedAttribute'
import { writeSignedData } from './writers/writeSignedData'

/**
 * Countersign every SignerInfo of the CMS (AutoFirma's `countersign` over
 * the signers): each gains an unsigned countersignature attribute whose
 * SignerInfo signs its signature value. shortcut: countersignatures already
 * nested inside are not countersigned in turn; walk them when a sede asks.
 */
export const countersignCadesSignedData = (
  identity: CertificateIdentity,
  cms: Buffer,
  options: CadesCountersignOptions = {},
): Buffer => {
  const parts = readSignedDataParts(cms)
  const digest = options.digest ?? 'sha256'
  const signingTime = options.signingTime ?? new Date()
  const certificates = selectSignerCertificates(identity)
  const countersign = (target: Buffer): Buffer => {
    const signatureDigest = createHash(digest)
      .update(selectSignerInfoSignature(target))
      .digest()
    const counter = buildSignerInfo(identity, digest, (signer) =>
      countersignatureAttributes(signatureDigest, signer, {
        signingTime,
        digest,
      }),
    )
    return addUnsignedAttribute(
      target,
      cmsAttribute(cmsOids.countersignature, [counter]),
    )
  }
  return writeSignedData({
    ...parts,
    digestAlgorithms: withDigestAlgorithm(parts.digestAlgorithms, digest),
    certificates: [
      ...parts.certificates,
      certificates.signer,
      ...certificates.chain,
    ],
    signerInfos: parts.signerInfos.map(countersign),
  })
}
