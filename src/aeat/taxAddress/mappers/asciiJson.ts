/**
 * JSON with every non-ASCII UTF-16 unit as a `\uXXXX` escape. The 036 `zkau`
 * decodes the form body as Latin-1, so raw UTF-8 turns "Disolución" into a
 * longer string the server refuses (Error LNGINC); escapes survive intact.
 */
export const asciiJson = (value: unknown): string => {
  const lastAscii = 0x7f
  return JSON.stringify(value)
    .split('')
    .map((unit) => {
      const code = unit.charCodeAt(0)
      return code > lastAscii
        ? `\\u${code.toString(16).padStart(4, '0')}`
        : unit
    })
    .join('')
}
