/**
 * The raw `asientos` array. It may be absent or null only when the Carpeta
 * explicitly reports zero results; any other shape is refused, so a malformed
 * answer cannot pass for an empty listing.
 */
export const readRegistryItems = (
  response: Record<string, unknown>,
  total: number,
): readonly unknown[] => {
  const items = response['asientos']
  if (Array.isArray(items)) return items
  if ((items === undefined || items === null) && total === 0) return []
  throw new Error('Carpeta: the consultaRegistros answer had no asientos list')
}
