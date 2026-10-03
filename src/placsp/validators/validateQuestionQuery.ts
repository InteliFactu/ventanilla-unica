import type { CliOptions } from '../../cli/types/CliOptions'
import { mapTenderUrl } from '../mappers/mapTenderUrl'
import type { QuestionQuery } from '../types/QuestionQuery'

/** Check `placsp pregunta` options before any request. */
export const validateQuestionQuery = (options: CliOptions): QuestionQuery => {
  const expediente = options['expediente']
  const textFile = options['texto-file']
  if (!expediente)
    throw new Error("--expediente is required: the tender's PLACSP link")
  if (!textFile) throw new Error('--texto-file is required: the question text')
  return { tenderUrl: mapTenderUrl(expediente), textFile }
}
