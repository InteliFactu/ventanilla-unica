/** One código de cuenta de cotización of the holder, as RETC0001 lists it. */
export type EmployerAccount = {
  /** Régimen, provincia and número joined: `0111 10 109728606`. */
  readonly ccc: string
  /** `PRIN` for the principal account, `SECU` for a secondary one. */
  readonly tipo: string
  /** `ALTA` or `BAJA`, as the portal writes it. */
  readonly situacion: string
  /** Date of that situation, DD/MM/YYYY. */
  readonly fechaSituacion: string
  readonly razonSocial: string
  /** The RED authorisation managing the account (`NO AS.` when none). */
  readonly autorizacionRed: string
}
