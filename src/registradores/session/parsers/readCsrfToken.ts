/** The Spring `_csrf` token a `site` page carries; one token serves the whole flow. */
export const readCsrfToken = (html: string): string | undefined =>
  /name="_csrf"\s+value="([^"]+)"/.exec(html)?.[1]
