import type { DigestName } from '../../types/DigestName'

/**
 * A digest named the ways AutoFirma's parameters name one: `SHA-256`,
 * `sha256`, `SHA256`, or an XML-DSig digest URI (`...#sha512`).
 */
export const parseDigestName = (value: string): DigestName => {
  const name = value.trim().toLowerCase().split('#').at(-1) ?? ''
  const match = /^sha-?(1|256|384|512)$/.exec(name)
  if (match?.[1] === undefined)
    throw new Error(`unsupported digest algorithm: ${value}`)
  return `sha${match[1]}` as DigestName
}
