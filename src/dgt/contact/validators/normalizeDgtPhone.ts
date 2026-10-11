/**
 * A phone number in the form the DGT posts (`00` + country code + number):
 * a nine-digit Spanish number gains `0034`, a `+` becomes `00`. Undefined
 * when it is not a phone number at all.
 */
export const normalizeDgtPhone = (phone: string): string | undefined => {
  const compact = phone.replace(/[\s.-]/g, '').replace(/^\+/, '00')
  if (/^[6-9]\d{8}$/.test(compact)) return `0034${compact}`
  return /^00\d{8,15}$/.test(compact) ? compact : undefined
}
