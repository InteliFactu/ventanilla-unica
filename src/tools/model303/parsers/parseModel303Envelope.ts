import { parseDraftFileHeader } from '../../../aeat/selfAssessmentDraft/parsers/parseDraftFileHeader'
import { validateBoeNif } from '../../boeFixedWidth/validators/validateBoeNif'
import type { Model303Envelope } from '../types/Model303Envelope'
import { isModel303Period } from '../validators/isModel303Period'

/** Read the 328-position file header and its matching 18-position closing tag. */
export const parseModel303Envelope = (content: string): Model303Envelope => {
  const { modelo, ejercicio, periodo } = parseDraftFileHeader(
    Buffer.from(content.slice(0, 17), 'latin1'),
  )
  const tag = `T3030${ejercicio}${periodo}0000`
  if (
    modelo !== '303' ||
    !isModel303Period(periodo) ||
    !content.startsWith(`<${tag}>`)
  )
    throw new Error('Modelo 303: invalid opening tag or period')
  const close = `</${tag}>`
  if (!content.endsWith(close))
    throw new Error('Modelo 303: expected a matching closing tag')
  const aux = /^<AUX> {70}[\p{L}\d ]{4} {4}[\p{L}\d ]{9} {213}<\/AUX>$/u
  if (!aux.test(content.slice(17, 328)))
    throw new Error('Modelo 303: invalid AUX block at positions 18-328')
  const [nifProblem] = validateBoeNif(
    content.slice(100, 109),
    'software NIF (101-109)',
    true,
  )
  if (nifProblem !== undefined) throw new Error(`Modelo 303: ${nifProblem}`)
  return { ejercicio, periodo, body: content.slice(328, -close.length) }
}
