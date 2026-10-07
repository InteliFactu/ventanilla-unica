/** The action and exact body fields the simplified application would post. */
export type SimplifiedApplicationFields = {
  readonly action: string
  readonly fields: Readonly<Record<string, string>>
}
