/** One cookie as the jar keeps it: its value and the path it is sent on. */
export type StoredCookie = {
  readonly value: string
  readonly path: string
}
