import { validateNif } from '../../../tools/nif/validators/validateNif'

/** `[--nif]`: the interesado filed for, checked offline; left out, the holder files in their own name. */
export const validateInteresadoNifOption = (
  value: string | undefined,
): string | undefined => {
  if (value === undefined) return undefined
  const check = validateNif(value)
  if (!check.valido)
    throw new Error(`--nif ${value} is not valid: ${check.motivo ?? ''}`)
  return check.normalizado
}
