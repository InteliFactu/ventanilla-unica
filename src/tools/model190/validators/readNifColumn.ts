import { validateNif } from '../../nif/validators/validateNif'
import { requireColumn } from './requireColumn'

/** A column holding a NIF, normalized; refuses one whose control character fails. */
export const readNifColumn = (
  row: Readonly<Record<string, string>>,
  column: string,
): string => {
  const validation = validateNif(requireColumn(row, column))
  if (!validation.valido)
    throw new Error(
      `modelo 190: ${column} ${validation.valor} is not a valid NIF (${validation.motivo ?? ''})`,
    )
  return validation.normalizado
}
