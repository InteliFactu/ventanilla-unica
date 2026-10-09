/** A local PDF checked before any request: where it is, its size and SHA-256. */
export type RelecFile = {
  readonly path: string
  readonly name: string
  readonly bytes: number
  readonly sha256: string
}
