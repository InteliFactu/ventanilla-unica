import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { importAndPressValidar } from './fetchers/importAndPressValidar'
import { openPresentationForm } from './fetchers/openPresentationForm'
import { openSignatureDialog } from './fetchers/openSignatureDialog'
import { sendAndKeepAnswers } from './fetchers/sendAndKeepAnswers'
import { presentationPlan } from './mappers/presentationPlan'
import { parseDraftFileHeader } from './parsers/parseDraftFileHeader'
import { parseDraftFileHolder } from './parsers/parseDraftFileHolder'
import { parsePresentationCheck } from './parsers/parsePresentationCheck'
import type { SelfAssessmentReceipt } from './types/SelfAssessmentReceipt'
import { validatePresentationCheck } from './validators/validatePresentationCheck'

/**
 * `aeat presentar-autoliquidacion`: import and validate a 303 file in the
 * holder's presentation form and walk it to the "Diálogo Firma", filing
 * nothing; only with `confirm` tick "Conforme" and sign and send it.
 */
export const presentSelfAssessment = async (
  client: HttpClient,
  file: Buffer,
  confirm: boolean,
  outDir?: string,
): Promise<WriteResult<SelfAssessmentReceipt>> => {
  const header = parseDraftFileHeader(file)
  if (header.modelo !== '303')
    throw new Error(`only the 303 is supported, the file is a ${header.modelo}`)
  const holder = parseDraftFileHolder(file)
  const action = `file AEAT modelo 303 ${header.ejercicio}${header.periodo} of ${holder.nif} ${holder.nombre}`
  const open = await openPresentationForm(client, header, holder)
  const validation = await importAndPressValidar(open, file)
  const notes = validation.notices.map(
    (n) => `${n.kind} ${n.code} ${n.description}`,
  )
  if (!validation.passed) return { action, executed: false, plan: [], notes }
  const dialog = await openSignatureDialog(open.session, open.html)
  const check = parsePresentationCheck(
    dialog.paymentAnswer,
    dialog.dialogAnswer,
  )
  validatePresentationCheck(check, holder)
  const plan = presentationPlan(check)
  if (!confirm) return { action, executed: false, plan, notes }
  const receipt = await sendAndKeepAnswers(
    open.session,
    dialog.dialogAnswer,
    header,
    outDir,
  )
  return { action, executed: true, plan, receipt, notes }
}
