/** `00` under A, which has no subclave; two digits are mandatory under L. */
export const readSubclave = (
  clave: 'A' | 'L',
  value: string | undefined,
): string => {
  const subclave = (value ?? '').trim()
  if (clave === 'A') return '00'
  if (!/^\d{2}$/.test(subclave))
    throw new Error(`modelo 190: clave L needs a two-digit subclave`)
  return subclave
}
