import { parseForms } from '../../../html/parsers/parseForms'
import { readAttribute } from '../../../html/readAttribute'
import type { HtmlForm } from '../../../html/types/HtmlForm'
import { readCarpetaInputFields } from './readCarpetaInputFields'
import { readCarpetaSelectFields } from './readCarpetaSelectFields'

/** Successful HTML controls only: never post an unrelated button or an unchecked consent. */
export const readCarpetaForm = (
  html: string,
  url: string,
  id: string,
): HtmlForm => {
  const block = [...html.matchAll(/<form\b[\s\S]*?<\/form>/gi)]
    .map(([tag]) => tag)
    .find((tag) => readAttribute(tag.split('>')[0] ?? '', 'id') === id)
  const form = block ? parseForms(block, url)[0] : undefined
  if (!block || !form) throw new Error(`Junta: missing form ${id}`)
  return {
    action: form.action.replace('http:', 'https:'),
    fields: {
      ...readCarpetaInputFields(block),
      ...readCarpetaSelectFields(block),
    },
  }
}
