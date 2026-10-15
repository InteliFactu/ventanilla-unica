/** Decode the `\uXXXX` escapes a page's script leaves in the values it writes into inputs. */
export const decodeJsUnicodeEscapes = (text: string): string =>
  text.replaceAll(/\\u([0-9A-Fa-f]{4})/g, (_, hex: string) =>
    String.fromCodePoint(Number.parseInt(hex, 16)),
  )
