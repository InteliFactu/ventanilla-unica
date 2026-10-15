import type { DigestName } from '../types/DigestName'
import { xadesUris } from './xadesUris'

/** The ds:DigestMethod Algorithm URI of each digest. */
export const digestUris: Readonly<Record<DigestName, string>> = {
  sha1: xadesUris.sha1,
  sha256: xadesUris.sha256,
  sha384: xadesUris.sha384,
  sha512: xadesUris.sha512,
}
