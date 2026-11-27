import { model303Layouts } from '../layouts/model303Layouts'
import { parseModel303Envelope } from '../parsers/parseModel303Envelope'
import { parseModel303Pages } from '../parsers/parseModel303Pages'
import type { Model303FileValidation } from '../types/Model303FileValidation'
import { isModel303PrintableText } from './isModel303PrintableText'
import { validateModel303Pages } from './validateModel303Pages'

/** Validate a decoded ISO-8859-1 file against the 2025 or 2026 workbook. */
export const validateModel303File = (
  content: string,
): Model303FileValidation => {
  if (!isModel303PrintableText(content))
    throw new Error(
      'Modelo 303: expected printable ISO-8859-1 characters without line breaks',
    )
  const envelope = parseModel303Envelope(content)
  const layouts = model303Layouts[envelope.ejercicio]
  if (layouts === undefined)
    throw new Error(`Modelo 303: unsupported exercise ${envelope.ejercicio}`)
  const pages = parseModel303Pages(envelope.body, layouts)
  const problems = validateModel303Pages(pages, envelope)
  return {
    modelo: '303',
    ejercicio: envelope.ejercicio,
    periodo: envelope.periodo,
    registros: pages.length,
    validation: 'layout',
    valid: problems.length === 0,
    problems,
  }
}
