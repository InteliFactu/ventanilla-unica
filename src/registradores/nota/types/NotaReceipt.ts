/** What ordering a nota leaves: the price the pago page showed and the card checkout to pay it. */
export type NotaReceipt = {
  readonly price: string | undefined
  readonly checkoutUrl: string
  readonly checkoutPage?: string | undefined
}
