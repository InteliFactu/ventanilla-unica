import { buildModel190File } from '../../../tools/model190/builders/buildModel190File'
import { declarant } from '../../../tools/model190/fixtures/declarant'
import { perceptorCsv } from '../../../tools/model190/fixtures/perceptorCsv'
import { parsePerceptorRows } from '../../../tools/model190/parsers/parsePerceptorRows'

/** The synthetic modelo 190 of the generator's own fixtures: declarant 00000005M, three records. */
export const bulkFileText = buildModel190File(
  declarant,
  parsePerceptorRows(perceptorCsv),
)
