import type { AeatPowerDirection } from '../types/AeatPowerDirection'

/** The filter field naming the other party: the apoderado on the granted list, the poderdante on the received one. */
export const powerCounterpartField = (direction: AeatPowerDirection): string =>
  direction === 'granted' ? 'FORM_NIF_APODERADO' : 'FORM_NIF_PODERDANTE'
