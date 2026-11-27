import { validateNif } from '../../nif/validators/validateNif'

/** Validate the exact on-disk spelling of a Spanish tax identifier. */
export const validateBoeNif = (
  value: string,
  field: string,
  optional = false,
): readonly string[] => {
  if (optional && value.trim() === '') return []
  const nif = validateNif(value)
  return nif.valido && nif.normalizado === value
    ? []
    : [`${field}: invalid Spanish NIF`]
}
