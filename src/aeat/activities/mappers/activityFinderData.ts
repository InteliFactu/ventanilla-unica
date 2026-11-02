import type { EconomicActivity } from '../types/EconomicActivity'

/** The `onValorDevuelto` payload the AEAT activity finder sends back to casilla 400. */
export const activityFinderData = (
  activity: EconomicActivity,
): Record<string, string> => ({
  '': JSON.stringify({
    actividad: activity.tipo,
    seccion: activity.seccion,
    epigrafe: activity.epigrafe,
    descripcion: activity.descripcion,
  }),
})
