import type { RelecSlot } from '../types/RelecSlot'

/** The form row a `--filas` entry names, by its `DocReq` dboid or its name (case-insensitive). */
export const selectRelecSlot = (
  slots: readonly RelecSlot[],
  row: string,
): RelecSlot => {
  const wanted = row.toLowerCase()
  const matches = slots.filter(
    (candidate) =>
      candidate.dboid === row || candidate.name.toLowerCase() === wanted,
  )
  if (matches.length > 1)
    throw new Error(`the form row "${row}" is ambiguous; use its DocReq id`)
  const [slot] = matches
  if (slot === undefined)
    throw new Error(
      `the form has no row "${row}"; rows: ${slots.map((candidate) => candidate.name).join(', ')}`,
    )
  return slot
}
