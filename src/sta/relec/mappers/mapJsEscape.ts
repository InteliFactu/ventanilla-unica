/**
 * JavaScript's legacy `escape()`, which the sede applies to the form XML name
 * before hex-encoding it into the download id: `[A-Za-z0-9@*_+./-]` kept,
 * other UTF-16 code units as `%XX` or `%uXXXX`.
 */
export const mapJsEscape = (text: string): string =>
  text.replaceAll(/[^\w@*+./-]/g, (char) => {
    const code = char.charCodeAt(0)
    const hex = code.toString(16).toUpperCase()
    return code < 0x1_00
      ? `%${hex.padStart(2, '0')}`
      : `%u${hex.padStart(4, '0')}`
  })
