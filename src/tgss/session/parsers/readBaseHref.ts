/**
 * The URL a page's relative form actions resolve against: its `<base href>`,
 * itself relative on the PGIS pages, or the page URL when it has none.
 * WebSphere Portal serves the login page under a `z0` URL whose `<base>` points
 * at `z1`; posting against the page URL renders a theme-less error page.
 */
export const readBaseHref = (html: string, pageUrl: string): string => {
  const href = /<base\s+href=["']([^"']+)["']/i.exec(html)?.[1]
  return href ? new URL(href, pageUrl).toString() : pageUrl
}
