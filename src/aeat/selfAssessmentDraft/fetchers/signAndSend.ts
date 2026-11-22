import { findWidgetUuid } from '../../taxAddress/parsers/findWidgetUuid'
import { parsePresenvaliPayload } from '../../taxAddress/parsers/parsePresenvaliPayload'
import type { DraftSession } from '../types/DraftSession'
import { postDraftEvent } from './postDraftEvent'
import { pressDraftButton } from './pressDraftButton'

/**
 * THE ACT: tick "Conforme" and press the dialog's "Firmar y Enviar"
 * (`btnAceptarEnvio`), which files the declaration with the client
 * certificate; then echo the desktop-level `onPresenvali` the page script
 * sends, when the answer asks for it, which renders the receipt. Never retry
 * after `btnAceptarEnvio`: each retry files the declaration again.
 */
export const signAndSend = async (
  session: DraftSession,
  dialogAnswer: string,
): Promise<readonly string[]> => {
  await postDraftEvent(session, {
    cmd: 'onCheck',
    uuid: findWidgetUuid([dialogAnswer], 'chAceptar'),
    data: { '': true },
  })
  const accepted = await pressDraftButton(
    session,
    findWidgetUuid([dialogAnswer], 'btnAceptarEnvio'),
  )
  if (!accepted.includes("'onPresenvali'")) return [accepted]
  const presented = await postDraftEvent(session, {
    cmd: 'onPresenvali',
    data: { '': [parsePresenvaliPayload(accepted)] },
  })
  return [accepted, presented]
}
