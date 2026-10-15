import { normalizeLabel } from '../../../html/mappers/normalizeLabel'
import type { CatalogEntry } from '../types/CatalogEntry'

/** Find a DIR3 catalogue entry by code or by name, accents and case ignored. */
export const selectCatalogEntry = (
  entries: readonly CatalogEntry[],
  wanted: string,
  what: string,
): CatalogEntry => {
  const entry =
    entries.find((item) => item.code === wanted) ??
    entries.find((item) => normalizeLabel(item.name) === normalizeLabel(wanted))
  if (!entry)
    throw new Error(`REG: no ${what} "${wanted}" in the DIR3 catalogue`)
  return entry
}
