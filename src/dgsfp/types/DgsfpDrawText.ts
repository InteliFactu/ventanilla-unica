/** A run of text placed on a page, in points from the bottom-left corner. */
export type DgsfpDrawText = {
  readonly x: number
  readonly y: number
  readonly size: number
  readonly bold: boolean
  readonly text: string
}
