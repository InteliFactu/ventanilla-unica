/** Escape a value for a double-quoted HTML attribute the way the portal does, accents as named entities. */
export const escapeTestAttribute = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('í', '&iacute;')
