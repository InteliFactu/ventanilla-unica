/** The comma-separated `--documentos` value as a list of paths, blanks dropped. */
export const parseDocumentList = (
  value: string | undefined,
): readonly string[] =>
  (value ?? '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean)
