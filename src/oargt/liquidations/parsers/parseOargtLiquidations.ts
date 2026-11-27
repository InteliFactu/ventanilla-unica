import { stripInactiveAgreementMarkup } from '../../../aeat/debts/parsers/stripInactiveAgreementMarkup'
import type { OargtLiquidationsResult } from '../types/OargtLiquidationsResult'
import { isEmptyOargtLiquidationWidget } from '../validators/isEmptyOargtLiquidationWidget'
import { readOargtLiquidationWidget } from './readOargtLiquidationWidget'

/**
 * The "Mis liquidaciones" page (`PAGE_CODE=LISTALIQ`): its two widgets,
 * `LISTALIQ_TODAS` and `LISTALIQ_REPRESENTANTE`, each say when they are
 * empty. Only empty lists have been seen live, so a widget that lists
 * something is refused rather than read as a guess.
 */
export const parseOargtLiquidations = (
  html: string,
): OargtLiquidationsResult => {
  const active = stripInactiveAgreementMarkup(html)
  const own = readOargtLiquidationWidget(active, 'LISTALIQ_TODAS')
  const represented = readOargtLiquidationWidget(
    active,
    'LISTALIQ_REPRESENTANTE',
  )
  if (own === undefined || represented === undefined)
    throw new Error(
      'OARGT: the page carries no "Mis liquidaciones" list with both expected widgets',
    )
  if (
    !isEmptyOargtLiquidationWidget(own, 'No tiene ninguna liquidación') ||
    !isEmptyOargtLiquidationWidget(
      represented,
      'No tiene liquidaciones como representante',
    )
  )
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
