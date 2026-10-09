/** The `|`-separated `--descripciones` value as a list, each trimmed; blanks kept so positions still match the documents. */
export const splitDescriptions = (value: string | undefined): string[] =>
  value === undefined || value.trim() === ''
    ? []
    : value.split('|').map((text) => text.trim())
