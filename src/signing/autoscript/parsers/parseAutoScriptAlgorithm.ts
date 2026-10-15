import type { DigestName } from '../../types/DigestName'
import type { AutoScriptAlgorithm } from '../types/AutoScriptAlgorithm'

/**
 * Read an AutoScript `algorithm`: `SHA<n>with<RSA|ECDSA>`, or the bare digest
 * (`sha256`, `SHA-512`) AutoFirma also accepts. Anything else is refused
 * rather than signed with a guessed digest.
 */
export const parseAutoScriptAlgorithm = (
  value: string,
): AutoScriptAlgorithm => {
  const match = /^sha-?(1|256|384|512)(?:with(rsa|ecdsa))?$/i.exec(value.trim())
  if (match?.[1] === undefined)
    throw new Error(`unsupported AutoScript algorithm: ${value}`)
  const family = match[2]?.toLowerCase()
  return {
    digest: `sha${match[1]}` as DigestName,
    keyType: family === undefined ? undefined : family === 'rsa' ? 'rsa' : 'ec',
  }
}
