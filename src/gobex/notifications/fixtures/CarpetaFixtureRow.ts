/** One synthetic notification row for the Carpeta Ciudadana fixtures. */
export type CarpetaFixtureRow = {
  readonly number: string
  readonly status: string
  /** The `j_id` suffix of the row's action link; omit for a row without one. */
  readonly link?: string | undefined
}
