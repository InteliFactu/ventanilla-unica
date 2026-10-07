import type { GobexRecord } from '../../types/GobexRecord'
import type { CarpetaAcceptancePlan } from '../types/CarpetaAcceptancePlan'
import type { CarpetaAcceptanceRequest } from '../types/CarpetaAcceptanceRequest'
import { isNotifiedNotification } from '../validators/isNotifiedNotification'
import { isPendingNotification } from '../validators/isPendingNotification'

/** The steps a confirmed acceptance would run for this row, and why it cannot run. */
export const planCarpetaAcceptance = (
  record: GobexRecord,
  request: CarpetaAcceptanceRequest,
): CarpetaAcceptancePlan => {
  const download = request.outDir
    ? [
        `Open the accepted notification and save its PDF (and the acuse, when the sede serves it as a PDF) under ${request.outDir}.`,
      ]
    : ['Without --out nothing is downloaded.']
  if (isNotifiedNotification(record))
    return {
      plan: ['Already accepted (Notificado): nothing to accept.', ...download],
      notes: [],
    }
  if (!isPendingNotification(record))
    return {
      plan: [],
      notes: [
        `Notification ${request.id} is ${record['status'] ?? 'in no known state'}: it cannot be accepted; junta carpeta-descargar downloads it.`,
      ],
    }
  return {
    plan: [
      "POST Notificaciones.jsf with the row's link: opens firmarAcuseRecibo.jsf, the acceptance screen.",
      'POST firmarAcuseRecibo.jsf with the confirmation panel\'s "Aceptar" button (A4J): the sede signs the acuse itself. The notification counts as notified today and STARTS every legal deadline it carries (recurso, alegaciones, pago).',
      ...download,
    ],
    notes: [],
  }
}
