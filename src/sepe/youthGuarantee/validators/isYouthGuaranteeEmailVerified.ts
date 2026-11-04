import { readYouthGuaranteeInputValue } from '../parsers/readYouthGuaranteeInputValue'
import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'

/** A link for an old address must not validate the newly declared address. */
export const isYouthGuaranteeEmailVerified = (
  html: string,
  answers: YouthGuaranteeAnswers,
): boolean => {
  const email = answers['2']?.['datosContacto.correoElectronicoC']
  return (
    readYouthGuaranteeInputValue(html, 'confirmaCorreo') === '1' &&
    (email === undefined ||
      email === readYouthGuaranteeInputValue(html, 'correoconfirmacion'))
  )
}
