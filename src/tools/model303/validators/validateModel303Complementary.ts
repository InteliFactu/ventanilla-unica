import { model303Page02Exclusions } from '../layouts/model303Page02Exclusions'
import type { Model303ComplementaryExclusion } from '../types/Model303ComplementaryExclusion'
import type { Model303Page } from '../types/Model303Page'

/** A complementary page may supply data only in the workbook's Comp fields. */
export const validateModel303Complementary = ({
  text,
  layout,
}: Model303Page): readonly string[] => {
  if (text.charAt(11) !== 'C') return []
  const exclusions: readonly Model303ComplementaryExclusion[] =
    layout.tag === '02000'
      ? model303Page02Exclusions
      : [[layout.length - 683, 672, ' ']]
  const problems: string[] = []
  for (const [start, width, fill] of exclusions) {
    const end = start + width - 1
    if (text.slice(start - 1, end) !== fill.repeat(width))
      problems.push(
        `positions ${String(start)}-${String(end)}: must be empty on a complementary page`,
      )
  }
  return problems
}
