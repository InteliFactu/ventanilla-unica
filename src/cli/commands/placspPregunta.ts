import { planPlacspQuestion } from '../../placsp/question/planPlacspQuestion'
import { validateQuestionQuery } from '../../placsp/validators/validateQuestionQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const placspPregunta: Command = {
  portal: 'placsp',
  action: 'pregunta',
  description:
    'Plan a question to the contracting body of a published PLACSP tender ("Solicitar Información"); --confirmar si refuses until an operator account exists and the form is captured',
  options: ['expediente', 'texto-file'],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    planPlacspQuestion(
      client,
      validateQuestionQuery(options),
      isConfirmed(options),
    ),
}
