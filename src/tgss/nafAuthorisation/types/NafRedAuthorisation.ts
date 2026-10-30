/** One RED authorisation that manages, or managed, the holder's NAF, as RETC0002 lists it. */
export type NafRedAuthorisation = {
  readonly autorizacionRed: string
  readonly razonSocial: string
  /** Start of the relation, DD/MM/YYYY. */
  readonly desde: string
  /** End of the relation, DD/MM/YYYY; empty while it is in force. */
  readonly hasta: string
}
