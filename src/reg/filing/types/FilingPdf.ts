/** One PDF to attach, read from disk. */
export type FilingPdf = {
  readonly name: string
  readonly content: Buffer
}
