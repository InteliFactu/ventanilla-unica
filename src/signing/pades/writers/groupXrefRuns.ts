import type { XrefOffset } from '../types/XrefOffset'
import type { XrefRun } from '../types/XrefRun'
import type { XrefRunBuilder } from '../types/XrefRunBuilder'

/** Sort the written objects and split them into runs of consecutive numbers. */
export const groupXrefRuns = (offsets: readonly XrefOffset[]): XrefRun[] => {
  const runs: XrefRunBuilder[] = []
  for (const entry of [...offsets].sort(
    (left, right) => left.num - right.num,
  )) {
    const last = runs.at(-1)
    if (last && last.first + last.entries.length === entry.num)
      last.entries.push(entry)
    else runs.push({ first: entry.num, entries: [entry] })
  }
  return runs
}
