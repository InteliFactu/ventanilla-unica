import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { validateYouthGuaranteeFieldAnswer } from './validateYouthGuaranteeFieldAnswer'

/** Only offered, editable controls can be declared; nothing is posted here. */
export const validateYouthGuaranteeAnswers = (
  answers: YouthGuaranteeAnswers,
  pages: readonly YouthGuaranteePage[],
): void => {
  for (const [step, values] of Object.entries(answers)) {
    const page = pages.find((candidate) => String(candidate.step) === step) ?? {
      step: Number(step),
      title: '',
      fields: [],
    }
    for (const [name, value] of Object.entries(values))
      validateYouthGuaranteeFieldAnswer(page, name, value)
  }
}
