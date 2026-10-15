import type { TeaExpedientesResult } from '../types/TeaExpedientesResult'

/**
 * The TEA "Mis expedientes" page (`TEWV-CORE/ResumenVlt`). Only the empty
 * list ("No existen expedientes que mostrar") has been seen live, so a page
 * that lists cases is refused rather than read as a guess.
 */
export const parseTeaExpedientes = (
  html: string,
  nif: string,
): TeaExpedientesResult => {
  if (html.includes('Contribuyente no autorizado'))
    throw new Error(
      `TEA: the sede refuses holder ${nif} ("Contribuyente no autorizado")`,
    )
  if (!html.includes(`"negrita">${nif} - `))
    throw new Error(`TEA: Mis expedientes is not showing holder ${nif}`)
  if (!html.includes('No existen expedientes que mostrar'))
    throw new Error(
      'TEA: Mis expedientes lists cases, whose layout has not been captured yet; nothing was read',
    )
  return {
    nif,
    hasExpedientes: false,
    coverage:
      'Tribunales Económico-Administrativos Mis expedientes for the certificate holder',
  }
}
