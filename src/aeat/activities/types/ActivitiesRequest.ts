import type { EconomicActivity } from './EconomicActivity'

/** A modelo 036 casilla 127: alta of activities carried on outside a fixed premises. */
export type ActivitiesRequest = {
  readonly nif: string
  readonly actividades: readonly EconomicActivity[]
  /** Fecha de alta of every activity (casilla 406), DD/MM/YYYY. */
  readonly fecha: string
  /** Province label as the 036 combobox prints it (`CACERES`). */
  readonly provincia: string
  /** Municipality label as the 036 combobox prints it (`CÁCERES`). */
  readonly municipio: string
  readonly lugar: string
  readonly firmado: string
  readonly calidad: string
  /** Fill the form and press "Validar declaración" at the AEAT; files nothing. */
  readonly validate: boolean
  readonly confirm: boolean
}
