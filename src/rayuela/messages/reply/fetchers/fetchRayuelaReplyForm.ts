import type { HttpClient } from '../../../../http/types/HttpClient'
import { parseRayuelaMessageParams } from '../parsers/parseRayuelaMessageParams'
import { readRayuelaConfigText } from '../parsers/readRayuelaConfigText'
import type { RayuelaReplyForm } from '../types/RayuelaReplyForm'
import { fetchRayuelaTemplate } from './fetchRayuelaTemplate'
/**
 * Open the reply form the way the portal does: render the message (`MENREC`;
 * the read mark is a separate `PROCESA` that is never sent), then the reply
 * template (`ENVMEN`) and its recipient (`DESMENRES`). Nothing is sent.
 */
export const fetchRayuelaReplyForm = async (
  client: HttpClient,
  inboxHtml: string,
  messageId: string,
): Promise<RayuelaReplyForm> => {
  const message = await fetchRayuelaTemplate(client, 'MENREC', 'PRESENTA', {
    ...parseRayuelaMessageParams(inboxHtml, messageId),
    AnteriorSiguiente: true,
  })
  if (message.config['permiteRespuestaIndividual'] !== true)
    throw new Error('Rayuela does not allow replying to this message')
  const xMenusu = readRayuelaConfigText(message.config, 'xMenusu')
  const sender = readRayuelaConfigText(message.config, 'xUsuarioRemitente')
  const form = await fetchRayuelaTemplate(client, 'ENVMEN', 'PRESENTA', {
    MODO: 'RESPONDER_INDIVIDUAL',
    X_MENUSU_RES: xMenusu,
    X_USUARIO_RES: '-1',
    datosDeConfigurable: readRayuelaConfigText(
      message.config,
      'datosDeConfigurableRemitenteAnterior',
    ),
  })
  const recipient = await fetchRayuelaTemplate(
    client,
    'DESMENRES',
    'PRESENTA',
    {
      MODO: 'RESPONDER_INDIVIDUAL',
      TIPO_DESTINATARIO: 'PARA',
      identificadorPPLMensaje: 'PLANTILLA_ENVMEN',
      X_MENUSU_RES: xMenusu,
      X_USUARIO_RES: '-1',
    },
  )
  const recipientId = readRayuelaConfigText(
    recipient.config,
    'X_USUARIO_REMITENTE',
  )
  if (recipientId !== sender)
    throw new Error('Rayuela reply recipient is not the message sender')
  return {
    subject: readRayuelaConfigText(form.config, 'tAsunto'),
    recipientId,
    recipientName: readRayuelaConfigText(recipient.config, 'DESTINATARIOS'),
    config: form.config,
  }
}
