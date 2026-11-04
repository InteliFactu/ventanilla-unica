import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { isYouthGuaranteeActiveAddressField } from './isYouthGuaranteeActiveAddressField'

export const validateYouthGuaranteeRequiredFields = (
  answers: YouthGuaranteeAnswers,
  pages: readonly YouthGuaranteePage[],
): void => {
  for (const page of pages) {
    for (const field of page.fields.filter(
      (control) => control.required && !control.readOnly,
    )) {
      if (
        page.step === 2 &&
        !isYouthGuaranteeActiveAddressField(
          field.name,
          answers['2']?.['datosDireccionContacto.tipoDomicilioC'],
        )
      )
        continue
      if (!answers[String(page.step)]?.[field.name]?.trim())
        throw new Error(
          `Garantía Juvenil: missing declared answer for ${field.name}`,
        )
    }
  }
}
