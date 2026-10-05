/**
 * A failed service call as one line: the sede's own message when it sent a
 * short text (a 400 "UserError", often JSON-quoted), the status otherwise
 * (WCF answers its errors as an HTML page).
 */
export const readServiceError = (
  path: string,
  status: number,
  text: string,
): string => {
  const maxMessage = 500
  const message = text.trim().replace(/^"(.*)"$/s, '$1')
  const readable =
    message !== '' && !message.startsWith('<') && message.length <= maxMessage
  return readable
    ? `DGSFP ${path}: ${message}`
    : `DGSFP ${path}: HTTP ${String(status)}`
}
