export const normalizeYouthGuaranteeMunicipality = (name: string): string =>
  name
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
