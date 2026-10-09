import type { HttpClient } from '../../http/types/HttpClient'
import { defaultSleep } from '../documents/defaultSleep'
import type { Sleep } from '../documents/types/Sleep'
import { fetchPendingNotifications } from '../notifications/fetchers/fetchPendingNotifications'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { attemptAppearance } from './attemptAppearance'
import { fetchAcceptLegalTextId } from './fetchers/fetchAcceptLegalTextId'
import { planAppearance } from './mappers/planAppearance'
import { openAppearanceSession } from './openAppearanceSession'
import type { AppearanceOutcome } from './types/AppearanceOutcome'
import type { AppearanceRequest } from './types/AppearanceRequest'
import type { AppearanceResult } from './types/AppearanceResult'

/**
 * `dehu comparecer`: list the pending notifications (a read) and plan; only
 * with `confirm` open each requested one that is still pending, which
 * STARTS its legal deadlines. An identifier that is not pending is reported,
 * never guessed at.
 */
export const appearAtNotifications = async (
  client: HttpClient,
  request: AppearanceRequest,
  sleep: Sleep = defaultSleep,
): Promise<AppearanceResult> => {
  const authData = await loginWithCertificate(client)
  const { notifications } = await fetchPendingNotifications(client, authData)
  const action = `comparecer DEHU notification(s) ${request.ids.join(', ')}`
  const plan = planAppearance(request.ids)
  const legalTextId = request.confirm
    ? await fetchAcceptLegalTextId(client, authData)
    : ''
  const outcomes: AppearanceOutcome[] = []
  const listingSession = { client, authData, legalTextId }
  let attempted = false
  for (const id of request.ids) {
    const found = notifications.find((item) => item.id === id)
    const reference = found?.reference
    if (!found || reference === undefined) {
      outcomes.push({ id, notPending: true, accepted: false })
      continue
    }
    if (!request.confirm) {
      const { subject, issuer, expiresAt } = found
      outcomes.push({
        id,
        reference,
        subject,
        issuer,
        expiresAt,
        accepted: false,
      })
      continue
    }
    const relogin = attempted
    attempted = true
    outcomes.push(
      await attemptAppearance(
        async () => openAppearanceSession(client, listingSession, relogin),
        { ...found, reference },
        request.outDir,
        sleep,
      ),
    )
  }
  return { action, executed: request.confirm, plan, outcomes }
}
