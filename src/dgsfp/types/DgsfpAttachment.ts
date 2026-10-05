/** A PDF bound to one file control, read and hashed before any request. */
export type DgsfpAttachment = {
  readonly field: string
  readonly name: string
  readonly content: Buffer
  readonly hash: string
}
