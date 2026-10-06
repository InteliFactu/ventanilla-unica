/** Situación familiar 1, 2 or 3; blank means 3, "not stated to the payer". */
export const readFamilySituation = (value: string | undefined): string => {
  const situacion = (value ?? '').trim() || '3'
  if (!['1', '2', '3'].includes(situacion))
    throw new Error(`modelo 190: situacion "${situacion}" must be 1, 2 or 3`)
  return situacion
}
