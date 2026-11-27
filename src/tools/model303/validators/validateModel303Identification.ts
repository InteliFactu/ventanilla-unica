import { validateBoeNif } from '../../boeFixedWidth/validators/validateBoeNif'
import type { Model303Envelope } from '../types/Model303Envelope'

/** The holder and tax period on page 1 must match a valid declaration identity. */
export const validateModel303Identification = (
  record: string,
  envelope: Model303Envelope,
): readonly string[] => {
  const problems = [...validateBoeNif(record.slice(13, 22), 'NIF (14-22)')]
  if (!/^[CDGINVUX]$/.test(record.charAt(12)))
    problems.push('position 13: invalid declaration type')
  if (!record.slice(22, 102).trim())
    problems.push('positions 23-102: missing holder name')
  if (record.slice(102, 108) !== `${envelope.ejercicio}${envelope.periodo}`)
    problems.push(
      'positions 103-108: exercise or period differs from the file tag',
    )
  return problems
}
