/** Everything a registry save carries besides the documents. */
export type RegistryContent = {
  readonly parties: Readonly<Record<string, unknown>>
  readonly data: readonly Readonly<Record<string, unknown>>[]
  readonly notificationEmail: string
}
