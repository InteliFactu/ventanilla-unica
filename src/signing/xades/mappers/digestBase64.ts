import { createHash } from 'node:crypto'

import type { DigestName } from '../../types/DigestName'

/** Base64 digest of `data`. */
export const digestBase64 = (
  digest: DigestName,
  data: Buffer | string,
): string => createHash(digest).update(data).digest('base64')
