import { createHash, randomBytes } from 'node:crypto'

import type { PkcePair } from '../types/PkcePair'

/** A fresh PKCE pair (RFC 7636, S256) and state for one login. */
export const buildPkcePair = (): PkcePair => {
  const verifier = randomBytes(32).toString('base64url')
  return {
    verifier,
    challenge: createHash('sha256').update(verifier).digest('base64url'),
    state: randomBytes(12).toString('base64url'),
  }
}
