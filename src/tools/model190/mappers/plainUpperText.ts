/**
 * Upper case without accents or punctuation, as the BOE designs ask for
 * alphanumeric fields. Ñ and Ç stay: the design keeps them in ISO-8859-1.
 */
export const plainUpperText = (value: string): string =>
  value
    .toUpperCase()
    .normalize('NFD')
    .replace(/N\u{303}/gu, '\u{D1}')
    .replace(/C\u{327}/gu, '\u{C7}')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^A-Z0-9\u{D1}\u{C7} ]/gu, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()
