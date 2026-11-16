import type { HttpClient } from '../../../http/types/HttpClient'
import type { WriteResult } from '../../../write/types/WriteResult'
import { fetchRayuelaPage } from '../../session/fetchers/fetchRayuelaPage'
import { listRayuelaMessages } from '../listRayuelaMessages'
import { fetchRayuelaReplyForm } from './fetchers/fetchRayuelaReplyForm'
import { sendRayuelaReply } from './fetchers/sendRayuelaReply'
import { buildRayuelaReplyHtml } from './mappers/buildRayuelaReplyHtml'
import type { RayuelaReplyReceipt } from './types/RayuelaReplyReceipt'
import type { RayuelaReplyRequest } from './types/RayuelaReplyRequest'
import { validateRayuelaReplyNotSent } from './validators/validateRayuelaReplyNotSent'
/**
 * Reply to one inbox message with a plain-text body. Without `confirm` every
 * read step runs (the message, the reply form, the sent box) and the plan
 * names the recipient, subject and text; confirmed, it sends exactly one
 * message, which Rayuela delivers to the teacher at once.
 */
export const replyToRayuelaMessage = async (
  client: HttpClient,
  request: RayuelaReplyRequest,
): Promise<WriteResult<RayuelaReplyReceipt>> => {
  const body = request.body.trim()
  if (body === '') throw new Error('The reply text is empty; nothing was sent')
  // The sent box is read first: opening another page between the reply form and the send drops the form's server state.
  const sent = await listRayuelaMessages(client, 'ENV')
  const inbox = await fetchRayuelaPage(client, 'RegMisMenPla')
  const form = await fetchRayuelaReplyForm(client, inbox, request.messageId)
  validateRayuelaReplyNotSent(sent, { ...form, body })
  const plan = [
    `Reply to message ${request.messageId}`,
    `To: ${form.recipientName}`,
    `Subject: ${form.subject}`,
    `Text: ${body}`,
  ]
  if (!request.confirm)
    return {
      action: 'rayuela responder',
      executed: false,
      plan,
      notes: ['Dry run: nothing was sent. Add --confirmar si to send.'],
    }
  const receipt = await sendRayuelaReply(
    client,
    form,
    buildRayuelaReplyHtml(body),
  )
  return {
    action: 'rayuela responder',
    executed: true,
    plan,
    receipt,
    notes: [
      'Sent once; check the sent box (`rayuela mensajes --bandeja ENV`).',
    ],
  }
}
