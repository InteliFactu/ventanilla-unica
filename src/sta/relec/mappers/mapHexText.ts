/**
 * The sede's `encodeHex`: the lowercase hex of a text's bytes. Every text it
 * is applied to here is ASCII (sanitised file names, ids), so UTF-8 and
 * Latin-1 agree.
 */
export const mapHexText = (text: string): string =>
  Buffer.from(text, 'utf8').toString('hex')
