import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildCadesCounterSignerInfo } from './builders/buildCadesCounterSignerInfo'
import { cmsAttribute } from './cmsAttribute'
import { cmsOids } from './cmsOids'
import { withDigestAlgorithm } from './mappers/withDigestAlgorithm'
import { readSignedDataParts } from './parsers/readSignedDataParts'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import type { CadesCountersignOptions } from './types/CadesCountersignOptions'
import { assertNoCadesArchiveTimestamp } from './validators/assertNoCadesArchiveTimestamp'
import { addUnsignedAttribute } from './writers/addUnsignedAttribute'
import { countersignCadesSignerTree } from './writers/countersignCadesSignerTree'
import { writeSignedData } from './writers/writeSignedData'

/**
 * Countersign selected original SignerInfos. Without a target, direct callers
 * keep top-level behavior. The tree and leaf targets include nested signers.
 */
export const countersignCadesSignedData = (
  identity: CertificateIdentity,
  cms: Buffer,
  options: CadesCountersignOptions = {},
): Buffer => {
  const parts = readSignedDataParts(cms)
  if (options.target !== undefined)
    parts.signerInfos.forEach(assertNoCadesArchiveTimestamp)
  const digest = options.digest ?? 'sha256'
  const signingTime = options.signingTime ?? new Date()
  const certificates = selectSignerCertificates(identity)
  const target = options.target
  const sign = (original: Buffer): Buffer =>
    buildCadesCounterSignerInfo(identity, original, digest, signingTime)
  return writeSignedData({
    ...parts,
    digestAlgorithms: withDigestAlgorithm(parts.digestAlgorithms, digest),
    certificates: [
      ...parts.certificates,
      certificates.signer,
      ...certificates.chain,
    ],
    signerInfos: parts.signerInfos.map((original) =>
      target === undefined
        ? addUnsignedAttribute(
            original,
            cmsAttribute(cmsOids.countersignature, [sign(original)]),
          )
        : countersignCadesSignerTree(original, target, sign),
    ),
  })
}
