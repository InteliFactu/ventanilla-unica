import { readAttribute } from '../../../html/readAttribute'
import { readInputFields } from './readInputFields'
import { readTextareaFields } from './readTextareaFields'

/** The fields a browser submits for the form with this id: hidden and text inputs and textareas. */
export const readFormFields = (
  html: string,
  formId: string,
): Record<string, string> => {
  const form = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].find(
    ([, tag = '']) => readAttribute(`<form ${tag}>`, 'id') === formId,
  )
  if (!form) throw new Error(`AEAT: the registry page has no form '${formId}'`)
  const inner = form[2] ?? ''
  return { ...readInputFields(inner), ...readTextareaFields(inner) }
}
