import type { RayuelaMessages } from '../../types/RayuelaMessages'
import type { RayuelaSentReply } from '../types/RayuelaSentReply'
/**
 * Refuse a reply the sent box already holds (same recipient, subject and
 * text). shortcut: the list preview may truncate a long body, so a long reply
 * is not recognised, when replies grow past a paragraph compare the full body.
 */
export const validateRayuelaReplyNotSent = (
  sent: RayuelaMessages,
  reply: RayuelaSentReply,
): void => {
  const normalise = (text: string): string =>
    text.replaceAll(/\s+/g, ' ').trim()
  const duplicate = sent.messages.find(
    (message) =>
      normalise(message.from) === normalise(reply.recipientName) &&
      normalise(message.subject) === normalise(reply.subject) &&
      normalise(message.body) === normalise(reply.body),
  )
  if (duplicate)
    throw new Error(
      `Rayuela already holds this reply in the sent box (id ${duplicate.id}); nothing was sent`,
    )
}
