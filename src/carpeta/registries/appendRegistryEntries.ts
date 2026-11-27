import type { RegistryEntry } from './types/RegistryEntry'

/** Keep each distinct registry entry once; a repeated list row violates pagination. */
export const appendRegistryEntries = (
  collected: RegistryEntry[],
  seen: Set<string>,
  page: readonly RegistryEntry[],
): void => {
  for (const entry of page) {
    const exchange = entry.exchangeCode?.trim()
    const key = exchange
      ? `exchange:${exchange}`
      : JSON.stringify([entry.number.toUpperCase(), entry.registeredAt])
    if (seen.has(key))
      throw new Error('Carpeta: consultaRegistros repeated a registry entry')
    seen.add(key)
    collected.push(entry)
  }
}
