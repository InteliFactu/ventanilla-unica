import type { StaPortal } from '../types/StaPortal'

/** The origin of each STA sede. */
export const staOrigins: Readonly<Record<StaPortal, string>> = {
  junta: 'https://tramites.juntaex.es',
  caceres: 'https://sede.caceres.es',
  oargt: 'https://sede.oargt.es',
}
