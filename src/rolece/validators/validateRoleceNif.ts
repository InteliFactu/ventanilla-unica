import { validateNif } from '../../tools/nif/validators/validateNif'

/** The `--nif` option, normalised and checked offline before any request; ROLECE echoes it back verbatim. */
export const validateRoleceNif = (nif: string | undefined): string => {
  if (!nif) throw new Error('--nif is required')
  const check = validateNif(nif)
  if (!check.valido)
    throw new Error(`--nif ${nif} is not valid: ${check.motivo ?? ''}`)
  return check.normalizado
}
