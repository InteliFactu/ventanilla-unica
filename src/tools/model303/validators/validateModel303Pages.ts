import { expandModel303FieldGroup } from '../mappers/expandModel303FieldGroup'
import type { Model303Envelope } from '../types/Model303Envelope'
import type { Model303Page } from '../types/Model303Page'
import { validateModel303Complementary } from './validateModel303Complementary'
import { validateModel303Field } from './validateModel303Field'
import { validateModel303PageContent } from './validateModel303PageContent'
import { validateModel303PageCount } from './validateModel303PageCount'
import { validateModel303Rectification } from './validateModel303Rectification'
import { validateModel303RegimePage } from './validateModel303RegimePage'

/** Validate field layouts, required pages, repeat markers and file identity. */
export const validateModel303Pages = (
  pages: readonly Model303Page[],
  envelope: Model303Envelope,
): readonly string[] => {
  const counts = new Map<string, number>()
  const problems = pages.flatMap(({ layout, text }, index) => {
    const { tag, fields } = layout
    const count = (counts.get(tag) ?? 0) + 1
    counts.set(tag, count)
    return [
      ...fields
        .flatMap(expandModel303FieldGroup)
        .flatMap((field) => validateModel303Field(text, field)),
      ...validateModel303PageCount(tag, text, count),
      ...(tag === '02000' || tag === '05000'
        ? validateModel303Complementary({ layout, text })
        : []),
      ...validateModel303PageContent({ layout, text }, envelope),
    ].map((problem) => `record ${String(index + 1)}, page ${tag}: ${problem}`)
  })
  const [first] = pages
  if (first?.layout.tag !== '01000')
    problems.push('the first page must be 01000')
  else
    problems.push(
      ...validateModel303RegimePage(first.text, counts.has('02000')),
    )
  const result = pages.find(({ layout }) => layout.tag === '03000')
  if (result === undefined) problems.push('result page 03000 is required')
  else {
    const bank = pages.find(({ layout }) => layout.tag === 'DID00')
    problems.push(
      ...validateModel303Rectification(
        result.text,
        bank?.text,
        envelope.ejercicio,
      ),
    )
  }
  return problems
}
