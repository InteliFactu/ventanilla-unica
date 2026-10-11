/** A field of a sede JSON object as trimmed text; empty when absent or not a string. */
export const readText = (value: unknown, key: string): string => {
  if (typeof value !== 'object' || value === null) return ''
  const field = (value as Record<string, unknown>)[key]
  return typeof field === 'string' ? field.trim() : ''
}
