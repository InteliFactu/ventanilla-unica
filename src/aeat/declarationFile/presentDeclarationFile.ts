import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { sendAndKeepAnswers } from '../selfAssessmentDraft/fetchers/sendAndKeepAnswers'
import { parsePresentationCheck } from '../selfAssessmentDraft/parsers/parsePresentationCheck'
import type { SelfAssessmentReceipt } from '../selfAssessmentDraft/types/SelfAssessmentReceipt'
import { validatePresentationCheck } from '../selfAssessmentDraft/validators/validatePresentationCheck'
import { openDeclarationSignatureDialog } from './fetchers/openDeclarationSignatureDialog'
import { readDeclarationFile } from './fetchers/readDeclarationFile'

/**
 * `aeat presentar-declaracion`: read a 390 file on its "Envío Fichero" page
 * and walk it to the "Diálogo Firma", filing nothing; only with `confirm`
 * tick "Conforme" and sign and send it, once.
 */
export const presentDeclarationFile = async (
  client: HttpClient,
  file: Buffer,
  confirm: boolean,
  outDir?: string,
): Promise<WriteResult<SelfAssessmentReceipt>> => {
  const { check, session, html } = await readDeclarationFile(client, file)
  const holder = check.holder
  const action = `file AEAT modelo ${check.modelo} ${check.ejercicio} of ${holder ? `${holder.nif} ${holder.nombre}` : 'an unread holder'}`
  const notes = check.notices.map((n) => `${n.kind} ${n.code} ${n.description}`)
  if (!holder || !check.valid)
    return { action, executed: false, plan: [], notes }
  const dialogAnswer = await openDeclarationSignatureDialog(session, html)
  // The 390 settles nothing, so there is no payment window to read.
  const signature = parsePresentationCheck('', dialogAnswer)
  validatePresentationCheck(signature, holder)
  const plan = [
    `signed by ${signature.signer} on behalf of ${signature.onBehalfOf}`,
  ]
  if (!confirm) return { action, executed: false, plan, notes }
  const receipt = await sendAndKeepAnswers(session, dialogAnswer, check, outDir)
  return { action, executed: true, plan, receipt, notes }
}
