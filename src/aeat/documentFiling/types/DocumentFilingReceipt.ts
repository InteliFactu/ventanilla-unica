/** What the registry answered to the signed filing, and where its pages were saved. */
export type DocumentFilingReceipt = {
  readonly csv?: string | undefined
  readonly registro?: string | undefined
  readonly fecha?: string | undefined
  readonly receiptPagePath?: string | undefined
  readonly justificantePath?: string | undefined
}
