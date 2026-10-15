/** A PDF with its signature's /ByteRange written and its /Contents placeholder located. */
export type PreparedPdfSignature = {
  readonly file: Buffer
  /** Offset of the `<` opening /Contents. */
  readonly contentsAt: number
  /** Offset just past the `>` closing /Contents. */
  readonly contentsEnd: number
}
