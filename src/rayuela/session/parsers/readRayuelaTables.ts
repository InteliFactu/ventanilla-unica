/** Only data tables are relevant; surrounding layout tables are nested. */
export const readRayuelaTables = (html: string): string[] =>
  Array.from(
    html.matchAll(
      /<table\s[^>]*class=["']TableData["'][^>]*>([\s\S]*?)<\/table>/gi,
    ),
    (match) => match[1] ?? '',
  )
