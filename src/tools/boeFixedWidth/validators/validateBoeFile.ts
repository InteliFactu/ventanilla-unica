import { parseBulkFile } from '../../../aeat/bulkFiling/parsers/parseBulkFile'
import { validateModel303File } from '../../model303/validators/validateModel303File'
import type { BoeFileValidation } from '../types/BoeFileValidation'
import { boeLayoutValidators } from './boeLayoutValidators'
import { validateBoeRecordSeparators } from './validateBoeRecordSeparators'

/** Validate a tagged modelo 303 or Latin-1 TGVI file locally. */
export const validateBoeFile = (content: string): BoeFileValidation => {
  if (content.startsWith('<T303')) return validateModel303File(content)
  const file = parseBulkFile(content)
  const { modelo, ejercicio, records, recordLength } = file
  if (!/^\d{3}$/.test(modelo) || !/^\d{4}$/.test(ejercicio))
    throw new Error(
      'BOE: expected an informative-return model and year in record 1',
    )
  const validateLayout = boeLayoutValidators[`${modelo}-${ejercicio}`]
  const problems = [
    ...validateBoeRecordSeparators(content, recordLength),
    ...(validateLayout?.(file) ?? []),
  ]
  return {
    modelo,
    ejercicio,
    registros: records.length + 1,
    validation: validateLayout ? 'layout' : 'structure',
    valid: problems.length === 0,
    problems,
  }
}
