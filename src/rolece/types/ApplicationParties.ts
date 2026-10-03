/** Who a ROLECE application document names, read from its UBL parties. */
export type ApplicationParties = {
  readonly operatorNif: string | undefined
  /** The person the portal expects to sign: the one logged in. */
  readonly senderNif: string | undefined
  readonly notificationEmail: string | undefined
  readonly province: string | undefined
}
