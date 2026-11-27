import type { Model303FileInput } from '../types/Model303FileInput'
import { validateModel303File } from '../validators/validateModel303File'

/** Write a complete tagged file from pre-encoded pages without altering their fields. */
export const buildModel303File = (input: Model303FileInput): string => {
  const tag = `T3030${input.ejercicio}${input.periodo}0000`
  const version = (input.softwareVersion ?? '').padEnd(4)
  const softwareNif = (input.softwareNif ?? '').padEnd(9)
  const aux = `<AUX>${' '.repeat(70)}${version}    ${softwareNif}${' '.repeat(213)}</AUX>`
  const content = `<${tag}>${aux}${input.pages.join('')}</${tag}>`
  const validation = validateModel303File(content)
  if (!validation.valid) throw new Error(validation.problems.join('\n'))
  return content
}
