/** One group as `/api/v3/preferencias-usuario` takes it; a day count of null means none. */
export type AlertPreference = {
  readonly prefNivelAgrupacion: number
  readonly primerAviso: number | null
  readonly segundoAviso: number | null
  readonly prefPush: boolean
  readonly prefEnvioMail: boolean
}
