import type { DeregistrationCause } from './DeregistrationCause'
import type { Successor } from './Successor'

/** A modelo 036 baja en el censo (casillas 150-152) of a legal entity or ESPJ. */
export type DeregistrationRequest = {
  readonly nif: string
  readonly causa: DeregistrationCause
  /** Fecha efectiva de la baja (casilla 152), DD/MM/YYYY. */
  readonly fecha: string
  readonly sucesores: readonly Successor[]
  readonly lugar: string
  readonly firmado: string
  readonly calidad: string
  /** Fill the form and press "Validar declaración" at the AEAT; files nothing. */
  readonly validate: boolean
  readonly confirm: boolean
}
