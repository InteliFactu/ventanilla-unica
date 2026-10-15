import type { RelecSlot } from '../types/RelecSlot'

/** The form row a `--filas` entry names, by its `DocReq` dboid or its name (case-insensitive). */
export const selectRelecSlot = (
  slots: readonly RelecSlot[],
  row: string,
): RelecSlot => {
  const wanted = row.toLowerCase()
  const slot = slots.find(
    (candidate) =>
      candidate.dboid === row || candidate.name.toLowerCase() === wanted,
  )
  if (slot === undefined)
    throw new Error(
      `the form has no row "${row}"; rows: ${slots.map((candidate) => candidate.name).join(', ')}`,
    )
  return slot
}
