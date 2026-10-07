/** Which existing registry entry to download the justificante of, and where to save it. */
export type StaRegistryReceiptRequest = {
  readonly csv: string
  readonly nif: string
  readonly registryNumber: string
  readonly outDir: string
}
