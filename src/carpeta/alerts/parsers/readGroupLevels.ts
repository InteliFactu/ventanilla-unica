/** The comma-separated group levels of `--grupos` (`1,3`), as numbers; anything else is an error. */
export const readGroupLevels = (text: string): readonly number[] => {
  const levels = text.split(',').map((part) => part.trim())
  if (levels.some((level) => !/^\d+$/.test(level)))
    throw new Error(
      `--grupos ${text} must list group levels separated by commas, as \`carpeta avisos\` shows them`,
    )
  return levels.map(Number)
}
