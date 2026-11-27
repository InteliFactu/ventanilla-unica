import type { DigestName } from '../types/DigestName'
import { xadesUris } from './xadesUris'

/** XMLDSig digest algorithms available for checking an original detached reference. */
export const detachedReferenceDigests: ReadonlyMap<string, DigestName> =
  new Map([
    [xadesUris.sha1, 'sha1'],
    [xadesUris.sha256, 'sha256'],
    [xadesUris.sha384, 'sha384'],
    [xadesUris.sha512, 'sha512'],
  ])
