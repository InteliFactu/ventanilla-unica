/** A document's bytes and the extension the visor reported for it (lower case, with the dot). */
export type VisorFile = {
  readonly extension: string
  readonly bytes: Buffer
}
