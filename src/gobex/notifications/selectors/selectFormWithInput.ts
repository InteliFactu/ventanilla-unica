import { parseForms } from '../../../html/parsers/parseForms'
import { readAttribute } from '../../../html/readAttribute'
import type { HtmlForm } from '../../../html/types/HtmlForm'
import { readButtonNames } from '../parsers/readButtonNames'

/**
 * The form holding an input named `inputName`, with every button left out of
 * its fields: JSF reads any posted button as a click, so the caller adds the
 * one it means to press.
 */
export const selectFormWithInput = (
  html: string,
  baseUrl: string,
  inputName: string,
): HtmlForm | undefined => {
  for (const [block] of html.matchAll(/<form\b[\s\S]*?<\/form>/gi)) {
    const holds = [...block.matchAll(/<input\b[^>]*>/gi)].some(
      ([tag]) => readAttribute(tag, 'name') === inputName,
    )
    const form = holds ? parseForms(block, baseUrl)[0] : undefined
    if (!form) continue
    const buttons = readButtonNames(block)
    const fields = Object.fromEntries(
      Object.entries(form.fields).filter(([key]) => !buttons.has(key)),
    )
    return { action: form.action, fields }
  }
  return undefined
}
