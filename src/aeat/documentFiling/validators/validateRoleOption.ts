import type { FilingRole } from '../types/FilingRole'

/** `--como interesado|representante`, as the registry's I/R code. */
export const validateRoleOption = (value: string | undefined): FilingRole => {
  if (value === 'interesado') return 'I'
  if (value === 'representante') return 'R'
  throw new Error('--como must be interesado or representante')
}
