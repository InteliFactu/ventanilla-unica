import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'

/** Only offered, editable controls can be declared; nothing is posted here. */
export const validateYouthGuaranteeAnswers = (
  answers: YouthGuaranteeAnswers,
  pages: readonly YouthGuaranteePage[],
): void => {
  for (const [step, values] of Object.entries(answers)) {
    const page = pages.find((candidate) => String(candidate.step) === step)
    for (const [name, value] of Object.entries(values)) {
      const field = page?.fields.find((candidate) => candidate.name === name)
      if (!field || field.readOnly)
        throw new Error(
          `Garantía Juvenil: ${name} is not an offered editable control on step ${step}`,
        )
      if (field.type === 'checkbox' && value === 'false') continue
      if (
        field.options.length > 0 &&
        !field.options.some((option) => option.value === value)
      )
        throw new Error(
          `Garantía Juvenil: unoffered answer for ${name} on step ${step}`,
        )
    }
  }
}
