/**
 * Red.es's answer to the request, as plain text. The portal renders it inside
 * the page body with no stable container, so the text is searched for the
 * success sentence and otherwise for its error boxes.
 */
export const readRequestOutcome = (html: string): string => {
  const text = html
    .replaceAll(/<script[\s\S]*?<\/script>/gi, ' ')
    .replaceAll(/<[^>]+>/g, ' ')
    .replaceAll(/&nbsp;/g, ' ')
    .replaceAll(/\s+/g, ' ')
  const success = /(?:La|El) [^.]*realizad[oa] con [eé]xito[^.]*\.?/i.exec(text)
  if (success) return success[0].trim()
  const error =
    /class="[^"]*(?:error|alert)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|span|li|ul)>/i.exec(
      html,
    )
  const detail = error?.[1]
    ?.replaceAll(/<[^>]+>/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim()
  throw new Error(
    `nic.es refused the email change: ${detail ?? text.slice(0, 300)}`,
  )
}
