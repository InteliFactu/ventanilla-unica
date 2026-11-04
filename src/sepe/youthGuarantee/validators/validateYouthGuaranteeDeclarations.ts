import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { validateYouthGuaranteeRequiredFields } from './validateYouthGuaranteeRequiredFields'

/** All legal declarations must come from explicit flags, never defaults. */
export const validateYouthGuaranteeDeclarations = (
  answers: YouthGuaranteeAnswers,
  pages: readonly YouthGuaranteePage[],
): void => {
  const declarations =
    pages
      .find((page) => page.step === 1)
      ?.fields.filter((field) => field.type === 'checkbox') ?? []
  if (
    declarations.length !== 5 ||
    declarations.some((field) => answers['1']?.[field.name] !== 'true') ||
    answers['6']?.['checkLOPD'] !== 'true'
  )
    throw new Error(
      'Garantía Juvenil: declare all five step-1 commitments and step-6 checkLOPD explicitly as true in --respuestas',
    )
  validateYouthGuaranteeRequiredFields(answers, pages)
}
