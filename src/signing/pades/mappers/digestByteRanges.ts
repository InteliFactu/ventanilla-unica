import { createHash } from 'node:crypto'

import type { DigestName } from '../../types/DigestName'
import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'

/** The digest of everything the signature covers: the file minus its /Contents. */
export const digestByteRanges = (
  prepared: PreparedPdfSignature,
  digest: DigestName,
): Buffer =>
  createHash(digest)
    .update(prepared.file.subarray(0, prepared.contentsAt))
    .update(prepared.file.subarray(prepared.contentsEnd))
    .digest()
