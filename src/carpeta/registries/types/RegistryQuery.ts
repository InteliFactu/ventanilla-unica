/** What `carpeta registros` asks for: a date range and, optionally, one registry number. */
export type RegistryQuery = {
  readonly from: Date
  readonly to: Date
  /** A registry number such as `REGAGE26e00000000001`; absent lists every entry in the range. */
  readonly number?: string | undefined
}
