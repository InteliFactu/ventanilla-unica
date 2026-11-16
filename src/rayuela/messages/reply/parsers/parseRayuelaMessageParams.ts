import { unescapeHtml } from '../../../../html/unescapeHtml'
/**
 * The inbox row's hidden `OpEmergente` input carries the parameters the portal
 * sends when it opens that message (`X_IDENTIFICADOR`, `X_MENUSU`, ...).
 */
export const parseRayuelaMessageParams = (
  html: string,
  messageId: string,
): Record<string, string> => {
  for (const match of html.matchAll(
    /<input\s[^>]*name=["']?OpEmergente\d+["']?\s+value=["']([^"']*)["']/gi,
  )) {
    const params = new URLSearchParams(unescapeHtml(match[1] ?? ''))
    if (params.get('X_IDENTIFICADOR') === messageId)
      return Object.fromEntries(params)
  }
  throw new Error(
    `Rayuela message ${messageId} is not on the first inbox page; nothing was sent`,
  )
}
