import { readDigitsColumn } from './readDigitsColumn'

/** Contrato o relación 1-4, mandatory under clave A. */
export const readContract = (row: Readonly<Record<string, string>>): string => {
  const contrato = readDigitsColumn(row, 'contrato', 1)
  if (!['1', '2', '3', '4'].includes(contrato))
    throw new Error(`modelo 190: contrato "${contrato}" must be 1 to 4`)
  return contrato
}
