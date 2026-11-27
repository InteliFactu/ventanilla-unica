/** Map a field that should be an array; anything else is an empty list. */
export const mapRegistryList = <T>(
  value: unknown,
  mapItem: (item: unknown) => T,
): T[] => (Array.isArray(value) ? value.map((item) => mapItem(item)) : [])
