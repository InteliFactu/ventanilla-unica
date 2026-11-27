/** A tag in the active catalogue HTML, with the literal content of a textarea. */
export type RelecCatalogueTag = {
  readonly name: string
  readonly closing: boolean
  readonly attributes: ReadonlyMap<string, string>
  readonly text: string
}
