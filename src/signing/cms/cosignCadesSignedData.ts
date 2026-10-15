import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildSignerInfo } from './builders/buildSignerInfo'
import { cadesSignedAttributes } from './cadesSignedAttributes'
import { withDigestAlgorithm } from './mappers/withDigestAlgorithm'
import { readSignedDataParts } from './parsers/readSignedDataParts'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import type { CadesCosignOptions } from './types/CadesCosignOptions'
import { validateCosignContent } from './validators/validateCosignContent'
import { writeSignedData } from './writers/writeSignedData'

/**
 * Add the holder's CAdES-B-B SignerInfo beside the existing ones (AutoFirma's
 * `cosign`): same content, same mode, the existing signatures untouched.
 * A detached CMS needs `options.content`.
 */
export const cosignCadesSignedData = (
  identity: CertificateIdentity,
  cms: Buffer,
  options: CadesCosignOptions = {},
): Buffer => {
  const parts = readSignedDataParts(cms)
  const content = validateCosignContent(parts, options.content)
  const digest = options.digest ?? 'sha256'
  const contentDigest = createHash(digest).update(content).digest()
  const certificates = selectSignerCertificates(identity)
  return writeSignedData({
    ...parts,
    digestAlgorithms: withDigestAlgorithm(parts.digestAlgorithms, digest),
    certificates: [
      ...parts.certificates,
      certificates.signer,
      ...certificates.chain,
    ],
    signerInfos: [
      ...parts.signerInfos,
      buildSignerInfo(identity, digest, (signer) =>
        cadesSignedAttributes(contentDigest, signer, {
          signingTime: options.signingTime ?? new Date(),
          digest,
          policy: options.policy,
        }),
      ),
    ],
  })
}
