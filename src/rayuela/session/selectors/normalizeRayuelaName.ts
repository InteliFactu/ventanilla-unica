/** Compare portal labels regardless of case, accent marks or given-name order. */
export const normalizeRayuelaName = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean)
    .sort()
    .join(' ')
