/** Require explicit, balanced row and cell boundaries before the regex readers run. */
export const hasCompletePaymentHistoryMarkup = (html: string): boolean => {
  const parents: Readonly<Record<string, readonly (string | undefined)[]>> = {
    table: [undefined],
    thead: ['table'],
    tbody: ['table'],
    tfoot: ['table'],
    tr: ['table', 'thead', 'tbody', 'tfoot'],
    td: ['tr'],
    th: ['tr'],
  }
  const open: string[] = []
  for (const [tag, closing, name = ''] of html.matchAll(
    /<(\/?)(table|thead|tbody|tfoot|tr|td|th)\b[^>]*>/gi,
  )) {
    const element = name.toLowerCase()
    if (closing === '/') {
      if (!/^<\/\w+\s*>$/.test(tag) || open.pop() !== element) return false
      continue
    }
    if (
      !parents[element]?.includes(open.at(-1)) ||
      /\b(?:colspan|rowspan)\s*=/i.test(tag)
    )
      return false
    open.push(element)
  }
  return open.length === 0
}
