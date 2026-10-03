/**
 * The ISO-8859-1 bytes of a text, as a page served in that charset submits
 * it. Refuses a character outside the charset rather than letting Node
 * truncate it to its low byte.
 */
export const encodeLatin1 = (text: string): Buffer => {
  const latin1Max = 0xff
  for (const char of text)
    if ((char.codePointAt(0) ?? 0) > latin1Max)
      throw new Error(
        `"${char}" has no ISO-8859-1 byte; the portal could not receive it`,
      )
  return Buffer.from(text, 'latin1')
}
