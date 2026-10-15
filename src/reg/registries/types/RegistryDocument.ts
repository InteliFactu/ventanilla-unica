/** One document of an entry; `voucher` marks the signed justificante. */
export type RegistryDocument = {
  readonly uuid: string
  readonly name: string
  readonly size: number
  readonly type: string
  readonly voucher: boolean
  readonly description: string
}
