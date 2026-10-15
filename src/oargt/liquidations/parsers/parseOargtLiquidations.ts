import type { OargtLiquidationsResult } from '../types/OargtLiquidationsResult'

/**
 * The "Mis liquidaciones" page (`PAGE_CODE=LISTALIQ`): its two widgets,
 * `LISTALIQ_TODAS` and `LISTALIQ_REPRESENTANTE`, each say when they are
 * empty. Only empty lists have been seen live, so a widget that lists
 * something is refused rather than read as a guess.
 */
export const parseOargtLiquidations = (
  html: string,
): OargtLiquidationsResult => {
  if (!html.includes('id="LISTALIQ_TODAS"'))
    throw new Error('OARGT: the page carries no "Mis liquidaciones" list')
  const own = !html.includes('No tiene ninguna liquidación')
  const represented = !html.includes(
    'No tiene liquidaciones como representante',
  )
  if (own || represented)
    throw new Error(
      'OARGT: "Mis liquidaciones" lists liquidations, whose layout has not been captured yet; nothing was read',
    )
  return {
    contactConfirmationPending: false,
    hasLiquidations: false,
    hasLiquidationsAsRepresentative: false,
    notes: [],
  }
}
