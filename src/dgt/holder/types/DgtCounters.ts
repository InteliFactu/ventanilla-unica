/** The Mi DGT home counters; a field is absent when the DGT did not give a number for it. */
export type DgtCounters = {
  readonly vehiculos?: number | undefined
  readonly sanciones?: number | undefined
  readonly registros?: number | undefined
  readonly puntos?: number | undefined
  readonly permisos?: number | undefined
  readonly citas?: number | undefined
  readonly representantes?: number | undefined
  readonly representados?: number | undefined
  /** New-notice badges the home shows on vehicles and sanctions. */
  readonly avisosVehiculos?: number | undefined
  readonly avisosSanciones?: number | undefined
}
