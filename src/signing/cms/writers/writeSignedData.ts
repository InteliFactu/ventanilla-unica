import { derContext } from '../../asn1/derContext'
import { derOid } from '../../asn1/derOid'
import { derSequence } from '../../asn1/derSequence'
import { derSetOf } from '../../asn1/derSetOf'
import { cmsOids } from '../cmsOids'
import type { SignedDataParts } from '../types/SignedDataParts'

/** Encode SignedData parts back into a ContentInfo, dropping repeated algorithms and certificates. */
export const writeSignedData = (parts: SignedDataParts): Buffer => {
  const unique = (items: readonly Buffer[]): readonly Buffer[] => [
    ...new Map(items.map((item) => [item.toString('hex'), item])).values(),
  ]
  const certificates = unique(parts.certificates)
  const signedData = derSequence([
    parts.version,
    derSetOf(unique(parts.digestAlgorithms)),
    parts.encapsulated,
    ...(certificates.length > 0 ? [derSetOf(certificates, 0xa0)] : []),
    ...(parts.crls ? [parts.crls] : []),
    derSetOf(parts.signerInfos),
  ])
  return derSequence([derOid(cmsOids.signedData), derContext(0, signedData)])
}
