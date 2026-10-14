/** The nº de orden printed on an INE letter: ten digits and a check letter (e.g. 1005484700I). */
export const validateIriaOrderNumber = (value: string | undefined): string => {
  const normalized = value?.trim().toUpperCase() ?? ''
  if (!/^\d{10}[A-Z]$/.test(normalized))
    throw new Error(
      '--orden must be the nº de orden of the INE letter: ten digits and a letter',
    )
  return normalized
}
