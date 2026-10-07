import type { DgsfpKeyValue } from '../types/DgsfpKeyValue'
import type { DgsfpListEntry } from '../types/DgsfpListEntry'

/**
 * Find a list element by key or by name (accents and case ignored), and
 * return it as the `{key, value}` pair the list control stores.
 */
export const selectListEntry = (
  list: readonly DgsfpKeyValue[],
  wanted: string,
  what: string,
): DgsfpListEntry => {
  const fold = (text: string): string =>
    text.normalize('NFD').replaceAll(/\p{M}/gu, '').trim().toLowerCase()
  const entry =
    list.find((item) => item.Key === wanted.trim()) ??
    list.find((item) => fold(item.Value) === fold(wanted))
  if (!entry) throw new Error(`DGSFP: no ${what} named "${wanted}"`)
  return { key: entry.Key, value: entry.Value }
}
