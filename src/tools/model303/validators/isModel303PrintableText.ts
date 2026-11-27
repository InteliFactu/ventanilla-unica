/** The design uses one-byte printable Latin-1 text with no record separators. */
export const isModel303PrintableText = (value: string): boolean =>
  !/[^\x20-\x7E\u{A0}-\u{FF}]/u.test(value)
