/** What the registry answered to the final submission, with the draft reference it closed. */
export type StaRegistryReceipt = {
  readonly reference: string
  readonly registryNumber: string
  readonly registeredAt: string
  /** CSV (`cud`) of the justificante, verifiable at `/sta/Utils/DocumentCheck`. */
  readonly csv: string
  /** Where the justificante PDF was saved, when `--out` was given. */
  readonly justificante?: string | undefined
}
