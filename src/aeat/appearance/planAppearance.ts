import type { AeatNotification } from './types/AeatNotification'
import type { AppearanceRequest } from './types/AppearanceRequest'
import type { AppearanceSteps } from './types/AppearanceSteps'

/** The steps a confirmed comparecencia would run, and why it cannot run yet. */
export const planAppearance = (
  pending: readonly AeatNotification[],
  request: AppearanceRequest,
): AppearanceSteps => {
  const notes: string[] = []
  if (pending.length === 0)
    notes.push('No pending notification at the AEAT sede for this holder.')
  const { ncc } = request
  if (!ncc) {
    if (pending.length > 0)
      notes.push('Pass --id <ncc> of one pending notification to plan it.')
    return { plan: [], notes }
  }
  if (!pending.some((row) => row.ncc === ncc))
    notes.push(
      `Notification ${ncc} is not pending (already read, or outside the last twelve months); nothing to appear at.`,
    )
  const plan = [
    `GET GNNO-JDIT/DetalleSede?ncc=${ncc}: the "firma básica" screen, pre-filled with the holder's NIF and name (checked against --nif ${request.nif}).`,
    'POST DetalleSede accion=firma FIR=FirmaBasica: the comparecencia. The notification counts as notified today and every legal deadline it carries (recurso, alegaciones, pago) starts counting.',
    ...(request.outDir
      ? [
          'POST DetalleSede accion=vernotif: save the notified act as a PDF.',
          'GET KATA-APLI cotejo with the CSV the firma prints: save the acuse de recibo as a PDF.',
        ]
      : ['Without --out the act and the acuse are not downloaded.']),
  ]
  return { plan, notes }
}
