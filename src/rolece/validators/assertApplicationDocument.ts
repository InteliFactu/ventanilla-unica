import { readApplicationParties } from '../parsers/readApplicationParties'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import type { SigningScreen } from '../types/SigningScreen'

/**
 * Refuse to sign unless the document the portal built is this operator's
 * application: its NIF, the notification address and the province asked
 * for, and the same operator in the form's hidden fields.
 */
export const assertApplicationDocument = (
  screen: SigningScreen,
  query: RegistrationQuery,
  province: string,
): void => {
  const parties = readApplicationParties(screen.document)
  const mismatches = [
    parties.operatorNif === query.nif
      ? ''
      : `operator ${parties.operatorNif ?? '?'}`,
    screen.fields['numDocumento'] === query.nif
      ? ''
      : `form holder ${screen.fields['numDocumento'] ?? '?'}`,
    parties.notificationEmail === query.email
      ? ''
      : `notification address ${parties.notificationEmail ?? '?'}`,
    parties.province === province ? '' : `province ${parties.province ?? '?'}`,
  ].filter(Boolean)
  if (mismatches.length > 0)
    throw new Error(
      `ROLECE: the application to sign is not the one planned for ${query.nif} (${mismatches.join(', ')}); nothing was signed`,
    )
}
