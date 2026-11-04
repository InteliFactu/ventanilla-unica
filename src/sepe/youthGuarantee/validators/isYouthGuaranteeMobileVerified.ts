import { readYouthGuaranteeInputValue } from '../parsers/readYouthGuaranteeInputValue'
import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'

/** The portal's reloadMovil also compares the verified and current numbers. */
export const isYouthGuaranteeMobileVerified = (
  html: string,
  answers: YouthGuaranteeAnswers,
): boolean => {
  const mobile = answers['2']?.['datosContacto.movilC']
  return (
    readYouthGuaranteeInputValue(html, 'confirmaMovil') === '1' &&
    (mobile === undefined ||
      mobile === readYouthGuaranteeInputValue(html, 'movilActual'))
  )
}
