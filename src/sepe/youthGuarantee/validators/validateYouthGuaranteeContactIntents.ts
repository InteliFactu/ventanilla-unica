import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import type { YouthGuaranteeVerificationFiles } from '../types/YouthGuaranteeVerificationFiles'
import { isYouthGuaranteeEmailVerified } from './isYouthGuaranteeEmailVerified'
import { isYouthGuaranteeMobileVerified } from './isYouthGuaranteeMobileVerified'

/** Any unverified state, a pending challenge included, needs explicit intent before a message. */
export const validateYouthGuaranteeContactIntents = (
  html: string,
  answers: YouthGuaranteeAnswers,
  files: YouthGuaranteeVerificationFiles,
): void => {
  if (!files.mobileIntent && !isYouthGuaranteeMobileVerified(html, answers))
    throw new Error(
      'Garantía Juvenil: the mobile is not verified (or a code is pending); pass --sms solicitar to send a new SMS or --sms reutilizar to submit the still-valid code in --pin-fichero. Stopped at step 2; nothing was sent.',
    )
  if (!files.emailIntent && !isYouthGuaranteeEmailVerified(html, answers))
    throw new Error(
      'Garantía Juvenil: the email is not verified (or a link is pending); pass --correo solicitar to send a new email or --correo reutilizar to follow the still-valid link in --enlace-fichero. Stopped at step 2; nothing was sent.',
    )
}
