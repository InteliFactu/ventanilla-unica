import type { HttpClient } from '../../../../http/types/HttpClient'
import { buildRayuelaReplySend } from '../mappers/buildRayuelaReplySend'
import type { RayuelaReplyForm } from '../types/RayuelaReplyForm'
import type { RayuelaReplyReceipt } from '../types/RayuelaReplyReceipt'
import { fetchRayuelaTemplate } from './fetchRayuelaTemplate'
/**
 * The one request that sends, preceded as in the portal by the read of the
 * recipient's digital-disconnection period, which only decides whether the
 * portal warns that no notification will go out. The send is never retried:
 * a doubtful answer is settled by reading the sent box.
 */
export const sendRayuelaReply = async (
  client: HttpClient,
  form: RayuelaReplyForm,
  html: string,
): Promise<RayuelaReplyReceipt> => {
  const send = buildRayuelaReplySend({
    form: form.config,
    recipientId: form.recipientId,
    html,
  })
  await fetchRayuelaTemplate(client, 'ENVMEN', 'PROCESA', {
    MODO: 'RECUPERA_PERIODO_USUARIO',
    DESTINATARIO: form.recipientId,
    CONFIG_ENVIO: send['CONFIG_ENVIO'],
  })
  const answer = await fetchRayuelaTemplate(client, 'ENVMEN', 'PROCESA', send)
  return { status: answer.status }
}
