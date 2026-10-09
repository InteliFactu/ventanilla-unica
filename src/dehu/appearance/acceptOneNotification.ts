import type { Sleep } from '../documents/types/Sleep'
import { downloadAcceptedNotification } from './downloadAcceptedNotification'
import { postNotificationAcceptance } from './fetchers/postNotificationAcceptance'
import { reauthenticateForAppearance } from './reauthenticateForAppearance'
import type { AppearanceOutcome } from './types/AppearanceOutcome'
import type { AppearanceSession } from './types/AppearanceSession'
import type { ReferencedNotification } from './types/ReferencedNotification'

/**
 * Re-authenticate, accept one pending notification and, with `outDir`, save
 * its act and acuse. A refusal is reported with its status, not thrown, so
 * the other requested notifications still get their turn.
 */
export const acceptOneNotification = async (
  session: AppearanceSession,
  notification: ReferencedNotification,
  outDir: string | undefined,
  sleep: Sleep,
): Promise<AppearanceOutcome> => {
  const ok = 200
  const { id, reference, subject, issuer, expiresAt } = notification
  const base = { id, reference, subject, issuer, expiresAt }
  const bearer = await reauthenticateForAppearance(session, reference)
  const status = await postNotificationAcceptance(
    session.client,
    bearer,
    reference,
  )
  if (status !== ok) return { ...base, accepted: false, status }
  if (outDir === undefined) return { ...base, accepted: true, status }
  const saved = await downloadAcceptedNotification(
    { client: session.client, authData: bearer },
    { id, reference },
    outDir,
    sleep,
  )
  return { ...base, accepted: true, status, ...saved }
}
