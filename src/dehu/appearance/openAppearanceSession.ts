import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import type { AppearanceSession } from './types/AppearanceSession'

/**
 * The session one acceptance runs under: the listing one for the first, a
 * fresh certificate login for each later one, because an appearance relay
 * spends the bearer it was given (2026-10-09: the second id of a run got no
 * Cl@ve form, the same id alone in a fresh run was accepted).
 */
export const openAppearanceSession = async (
  client: HttpClient,
  listingSession: AppearanceSession,
  relogin: boolean,
): Promise<AppearanceSession> =>
  relogin
    ? { ...listingSession, authData: await loginWithCertificate(client) }
    : listingSession
