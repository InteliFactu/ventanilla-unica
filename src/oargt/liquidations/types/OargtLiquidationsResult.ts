/** What `ventanilla-unica oargt liquidaciones` answers: whether the holder has liquidations, own or as representative. */
export type OargtLiquidationsResult = {
  readonly contactConfirmationPending: boolean
  /** False when the office says "No tiene ninguna liquidación"; unknown behind the contact gate. */
  readonly hasLiquidations?: boolean | undefined
  /** False when the office says "No tiene liquidaciones como representante"; unknown behind the contact gate. */
  readonly hasLiquidationsAsRepresentative?: boolean | undefined
  readonly notes: readonly string[]
}
