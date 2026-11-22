import { pressDraftButton } from '../../selfAssessmentDraft/fetchers/pressDraftButton'
import type { DraftSession } from '../../selfAssessmentDraft/types/DraftSession'
import { findWidgetUuid } from '../../taxAddress/parsers/findWidgetUuid'

/**
 * On a read "Envío Fichero" page, press "Presentar declaración" (`boton`),
 * and "Continuar" (`wsi`) when a warning window comes first: that opens the
 * "Diálogo Firma" and files nothing. The filing act is the dialog's own
 * "Presentar Declaración" (`btnAceptarEnvio`), which this never presses.
 */
export const openDeclarationSignatureDialog = async (
  session: DraftSession,
  html: string,
): Promise<string> => {
  const sendAnswer = await pressDraftButton(
    session,
    findWidgetUuid([html], 'boton'),
  )
  const dialogAnswer = sendAnswer.includes("id:'winAdvertenciaWarning'")
    ? await pressDraftButton(session, findWidgetUuid([sendAnswer], 'wsi'))
    : sendAnswer
  if (!dialogAnswer.includes("id:'ventanaDialogoFirma'"))
    throw new Error(
      'AEAT: the Envío Fichero page did not open the signature dialog',
    )
  return dialogAnswer
}
