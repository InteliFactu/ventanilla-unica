import type { DeregistrationCause } from '../types/DeregistrationCause'

/** The casilla 151 combo label of each cause, as the 036 escapes it in its JavaScript. */
export const deregistrationCauseLabel: Readonly<
  Record<DeregistrationCause, string>
> = {
  disolucion: 'Disoluci\\xF3n y liquidaci\\xF3n',
  otras: 'Otras causas de baja',
}
