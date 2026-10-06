import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithClave } from '../session/loginWithClave'
import { downloadCarpetaNotification } from './downloadCarpetaNotification'
import { findCarpetaNotification } from './fetchers/findCarpetaNotification'
import { openCarpetaNotification } from './fetchers/openCarpetaNotification'
import { postCarpetaAcceptance } from './fetchers/postCarpetaAcceptance'
import { planCarpetaAcceptance } from './mappers/planCarpetaAcceptance'
import type { CarpetaAcceptance } from './types/CarpetaAcceptance'
import type { CarpetaAcceptanceRequest } from './types/CarpetaAcceptanceRequest'
import { isNotifiedNotification } from './validators/isNotifiedNotification'
import { isPendingNotification } from './validators/isPendingNotification'

/**
 * `junta carpeta-comparecer`: find the notification (a read) and plan; only
 * with `confirm` accept a pending one, which STARTS its legal deadlines. An
 * already accepted one is never accepted again. With `outDir` the PDF is
 * then downloaded from a fresh search, where the row shows "Notificado".
 */
export const acceptJuntaCarpetaNotification = async (
  client: HttpClient,
  request: CarpetaAcceptanceRequest,
): Promise<CarpetaAcceptance> => {
  await loginWithClave(client)
  const located = await findCarpetaNotification(client, request.id)
  const { plan, notes } = planCarpetaAcceptance(located.record, request)
  const action = `accept Junta Carpeta Ciudadana notification ${request.id}`
  const answer = { action, plan, notes, notification: located.record }
  const pending = isPendingNotification(located.record)
  if (!request.confirm || notes.length > 0)
    return {
      ...answer,
      executed: false,
      accepted: isNotifiedNotification(located.record) && 'already',
    }
  if (pending)
    await postCarpetaAcceptance(
      client,
      await openCarpetaNotification(client, located),
    )
  const accepted = pending || 'already'
  if (!request.outDir) return { ...answer, executed: pending, accepted }
  const target = pending
    ? await findCarpetaNotification(client, request.id)
    : located
  const receipt = await downloadCarpetaNotification(
    client,
    target,
    request.outDir,
  )
  return { ...answer, executed: pending, accepted, receipt }
}
