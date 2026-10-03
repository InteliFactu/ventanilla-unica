import { encodeLatin1 } from './encodeLatin1'

/**
 * An `application/x-www-form-urlencoded` body as a browser builds it on a page
 * served in ISO-8859-1: each value's ISO-8859-1 bytes, alphanumerics and
 * `*-._` kept, a space as `+`, every other byte percent-encoded. A signed
 * document travels as its raw bytes this way.
 */
export const encodeLatin1Form = (
  fields: Readonly<Record<string, string>>,
): string => {
  const unreserved = /[\w*.-]/
  const encode = (text: string): string =>
    [...encodeLatin1(text)]
      .map((byte) => {
        const char = String.fromCodePoint(byte)
        if (char === ' ') return '+'
        if (unreserved.test(char)) return char
        return `%${byte.toString(16).toUpperCase().padStart(2, '0')}`
      })
      .join('')
  return Object.entries(fields)
    .map(([name, value]) => `${encode(name)}=${encode(value)}`)
    .join('&')
}
