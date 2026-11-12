import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { isYouthGuaranteeActiveAddressField } from './isYouthGuaranteeActiveAddressField'
import { isYouthGuaranteeRowField } from './isYouthGuaranteeRowField'

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
      // Rows cannot be verified in the draft yet, so a required one blocks the write.
      if (isYouthGuaranteeRowField(page.step, field.name))
        throw new Error(
          `Garantía Juvenil: step ${String(page.step)} requires a row for ${field.name}, which this command cannot add or verify in the draft; no inscription was submitted`,
        )
      if (!answers[String(page.step)]?.[field.name]?.trim())
        throw new Error(
          `Garantía Juvenil: missing declared answer for ${field.name}`,
        )
    }
  }
}
