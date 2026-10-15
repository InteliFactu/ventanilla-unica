import type { DigestName } from '../types/DigestName'
import { xadesUris } from './xadesUris'

/** The ds:SignatureMethod Algorithm URI of an ECDSA signature with each digest (RFC 6931). */
export const ecdsaSignatureUris: Readonly<Record<DigestName, string>> = {
  sha1: xadesUris.ecdsaSha1,
  sha256: xadesUris.ecdsaSha256,
  sha384: xadesUris.ecdsaSha384,
  sha512: xadesUris.ecdsaSha512,
}
