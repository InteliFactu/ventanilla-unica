import { htmlToText } from '../../../html/htmlToText'

/** Recognize the first row even if it has an omitted closing tag, for table selection only. */
export const readPaymentHistoryHeader = (
  fragment: string,
): readonly string[] => {
  const cellStart = fragment.search(/<t[dh]\b/i)
  if (cellStart < 0) return []
  const header =
    fragment
      .slice(cellStart)
      .split(/<\/?tr\b|<\/t(?:head|body|foot)\b/i, 1)[0] ?? ''
  return [
    ...header.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)(?=<\/t[dh]\b|<t[dh]\b|$)/gi),
  ].map(([, cell = '']) => htmlToText(cell))
}
