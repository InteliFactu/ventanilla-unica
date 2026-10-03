import type { StaPortal } from '../types/StaPortal'

/**
 * The "Registro Electrónico General" procedure id of each sede: the target of
 * `/sta/reg/auth/es/<id>`. Only the Junta's is known; the Cáceres sede has its
 * own catalogue and has not been captured.
 */
export const generalRegistryProcedures: Readonly<
  Partial<Record<StaPortal, string>>
> = {
  junta: '6269000000814004007984',
}
