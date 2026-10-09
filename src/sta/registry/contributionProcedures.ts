import type { StaPortal } from '../types/StaPortal'

/**
 * The "Aporte documentación" procedure id of each sede, which files documents
 * into an open expediente of the holder (AÑO/NUMERO, e.g. 2026/25777D) and
 * registers them as "Presentación de documentación complementaria" addressed
 * to the unit handling it. Only the Junta's is known.
 */
export const contributionProcedures: Readonly<
  Partial<Record<StaPortal, string>>
> = {
  junta: '6269000000810119707984',
}
