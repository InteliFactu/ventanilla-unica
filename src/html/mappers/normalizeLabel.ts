/** Upper case without diacritics or surrounding space, so "Cáceres" matches the portal's "CACERES". */
export const normalizeLabel = (value: string): string =>
  value
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .toUpperCase()
