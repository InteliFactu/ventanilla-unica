import type { DigestName } from '../types/DigestName'
import { xadesUris } from './xadesUris'

/** The ds:SignatureMethod Algorithm URI of an RSA signature with each digest. */
export const rsaSignatureUris: Readonly<Record<DigestName, string>> = {
  sha1: xadesUris.rsaSha1,
  sha256: xadesUris.rsaSha256,
  sha384: xadesUris.rsaSha384,
  sha512: xadesUris.rsaSha512,
}
