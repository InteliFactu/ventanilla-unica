import { findWidgetUuid } from '../../taxAddress/parsers/findWidgetUuid'
import { parseZkButtonUuid } from '../parsers/parseZkButtonUuid'
import type { DraftSession } from '../types/DraftSession'
import type { SignatureDialog } from '../types/SignatureDialog'
import { pressDraftButton } from './pressDraftButton'

/**
 * Walk a validated form up to the "Diálogo Firma", which files nothing:
 * "Presentar declaración" (`btnPagarModal`) opens the payment window, its
 * "Firmar y Enviar" (`cmd__firmarEnviar`) opens a warning window when the
 * declaration has avisos, whose "Continuar" (`wsi`) opens the dialog. The
 * filing act is the dialog's own "Firmar y Enviar" (`btnAceptarEnvio`),
 * which this never presses.
 */
export const openSignatureDialog = async (
  session: DraftSession,
  html: string,
): Promise<SignatureDialog> => {
  const paymentAnswer = await pressDraftButton(
    session,
    findWidgetUuid([html], 'btnPagarModal'),
  )
  const sendUuid = parseZkButtonUuid(paymentAnswer, 'cmd__firmarEnviar')
  if (sendUuid === undefined)
    throw new Error('AEAT: the payment window has no Firmar y Enviar button')
  const sendAnswer = await pressDraftButton(session, sendUuid)
  const dialogAnswer = sendAnswer.includes("id:'winAdvertenciaWarning'")
    ? await pressDraftButton(session, findWidgetUuid([sendAnswer], 'wsi'))
    : sendAnswer
  if (!dialogAnswer.includes("id:'ventanaDialogoFirma'"))
    throw new Error('AEAT: the form did not open the signature dialog')
  return { paymentAnswer, dialogAnswer }
}
