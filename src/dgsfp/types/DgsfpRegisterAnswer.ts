/** What `registrarPresentacionTelematica` answers on success. */
export type DgsfpRegisterAnswer = {
  readonly numRegistro: string
  readonly fechaRegistro: string
  readonly csv: string
  readonly justificanteRegistroB64?: string | undefined
  readonly nombreJustificante?: string | undefined
  readonly documentoSolicitudB64?: string | undefined
  readonly nombreDocumentoSolicitud?: string | undefined
}
