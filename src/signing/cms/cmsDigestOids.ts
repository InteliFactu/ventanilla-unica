import type { DigestName } from '../types/DigestName'
import { cmsOids } from './cmsOids'

/** The AlgorithmIdentifier OID of each digest. */
export const cmsDigestOids: Readonly<Record<DigestName, string>> = {
  sha1: cmsOids.sha1,
  sha256: cmsOids.sha256,
  sha384: cmsOids.sha384,
  sha512: cmsOids.sha512,
}
