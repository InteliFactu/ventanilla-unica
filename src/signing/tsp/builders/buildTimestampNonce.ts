import { randomBytes } from 'node:crypto'

/** Eight random bytes read as a positive INTEGER with no leading zero, so the reply echoes them as is. */
export const buildTimestampNonce = (): Buffer => {
  const nonce = randomBytes(8)
  nonce[0] = ((nonce[0] ?? 0) & 0x7f) | 0x01
  return nonce
}
