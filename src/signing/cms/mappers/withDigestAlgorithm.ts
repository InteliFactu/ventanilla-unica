import { derOid } from '../../asn1/derOid'
import { derSequence } from '../../asn1/derSequence'
import type { DigestName } from '../../types/DigestName'
import { cmsDigestOids } from '../cmsDigestOids'

/** SignedData digestAlgorithms plus `digest`, unless one already names it (with or without NULL parameters). */
export const withDigestAlgorithm = (
  algorithms: readonly Buffer[],
  digest: DigestName,
): readonly Buffer[] => {
  const oid = derOid(cmsDigestOids[digest])
  return algorithms.some((algorithm) => algorithm.includes(oid))
    ? algorithms
    : [...algorithms, derSequence([oid])]
}
