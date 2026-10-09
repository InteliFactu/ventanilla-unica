import type { Sleep } from '../documents/types/Sleep'
import { acceptOneNotification } from './acceptOneNotification'
import type { AppearanceOutcome } from './types/AppearanceOutcome'
import type { AppearanceSession } from './types/AppearanceSession'
import type { ReferencedNotification } from './types/ReferencedNotification'

/**
 * Accept one notification, turning a failure before DEHU answers into an
 * outcome with its `error`, so the acceptances already made in the same run
 * are still reported and the next requested one still gets its turn.
 */
export const attemptAppearance = async (
  session: AppearanceSession,
  notification: ReferencedNotification,
  outDir: string | undefined,
  sleep: Sleep,
): Promise<AppearanceOutcome> => {
  try {
    return await acceptOneNotification(session, notification, outDir, sleep)
  } catch (error) {
    const { id, reference, subject, issuer, expiresAt } = notification
    return {
      id,
      reference,
      subject,
      issuer,
      expiresAt,
      accepted: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
