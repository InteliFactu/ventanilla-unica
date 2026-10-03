/** The body of a `< ... >` PDF hex string decoded as WinAnsiEncoding; an odd final digit is padded with 0 as the spec says. */
export const decodePdfHexString = (body: string): string => {
  const digits = body.replaceAll(/\s/g, '')
  const even = digits.length % 2 === 0 ? digits : `${digits}0`
  return new TextDecoder('windows-1252').decode(Buffer.from(even, 'hex'))
}
