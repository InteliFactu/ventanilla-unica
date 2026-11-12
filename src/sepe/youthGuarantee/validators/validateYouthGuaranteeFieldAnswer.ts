import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { isYouthGuaranteeMunicipalityField } from './isYouthGuaranteeMunicipalityField'
import { validateYouthGuaranteeRowAnswer } from './validateYouthGuaranteeRowAnswer'

export const validateYouthGuaranteeFieldAnswer = (
  page: YouthGuaranteePage,
  name: string,
  value: string,
): void => {
  const field = page.fields.find((candidate) => candidate.name === name)
  if (!field || field.readOnly || name === 'pinSMS')
    throw new Error(
      `Garantía Juvenil: ${name} is not an offered editable control on step ${String(page.step)}`,
    )
  validateYouthGuaranteeRowAnswer(page.step, name)
  if (field.type === 'checkbox' && value === 'false') return
  // GET pages omit dependent options; only confirmed writes resolve these.
  if (page.step === 2 && isYouthGuaranteeMunicipalityField(name)) return
  if (
    field.options.length > 0 &&
    !field.options.some((option) => option.value === value)
  )
    throw new Error(
      `Garantía Juvenil: unoffered answer for ${name} on step ${String(page.step)}`,
    )
}
