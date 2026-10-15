import { unescapeHtml } from '../unescapeHtml'

/** The absolute target of a page's `<meta http-equiv="refresh" content="N; url=...">`, or undefined when it has none. */
export const parseMetaRefreshUrl = (
  html: string,
  baseUrl: string,
): string | undefined => {
  const match =
    /<meta[^>]+http-equiv=["']?refresh[^>]*content=["']\s*\d+\s*;\s*url=([^"']+)["']/i.exec(
      html,
    )
  return match?.[1] ? new URL(unescapeHtml(match[1]), baseUrl).href : undefined
}
