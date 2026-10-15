import type { DigestName } from '../types/DigestName'
import { cmsOids } from './cmsOids'

/** The ecdsa-with-SHA* signature algorithm OID of each digest (RFC 5758). */
export const cmsEcdsaOids: Readonly<Record<DigestName, string>> = {
  sha1: cmsOids.ecdsaWithSha1,
  sha256: cmsOids.ecdsaWithSha256,
  sha384: cmsOids.ecdsaWithSha384,
  sha512: cmsOids.ecdsaWithSha512,
}
