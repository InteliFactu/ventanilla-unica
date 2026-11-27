import { isInactiveAgreementElement } from '../validators/isInactiveAgreementElement'
import { readAgreementMarkupTags } from './readAgreementMarkupTags'

/** Exclude source-only markup and explicitly hidden elements with their descendants. */
export const stripInactiveAgreementMarkup = (html: string): string => {
  const source = html.replaceAll(
    /<!--[\s\S]*?(?:-->|$)|<(script|style|textarea|title|xmp|iframe|noembed|noframes|noscript)(?=[\s/>])(?:"[^"]*"|'[^']*'|[^"'<>])*>[\s\S]*?(?:<\/\1\s*>|$)/gi,
    '',
  )
  const parts: string[] = []
  let visibleFrom = 0
  let hiddenName: string | undefined
  let depth = 0
  for (const match of readAgreementMarkupTags(source)) {
    const captures: readonly string[] = match
    const [tag, closing, rawName, attributes] = captures as readonly [
      string,
      string,
      string,
      string,
    ]
    const name = rawName.toLowerCase()
    const index = match.index
    const end = index + tag.length
    const depthChange = closing ? -1 : 1
    if (hiddenName !== undefined) {
      if (name !== hiddenName) continue
      depth += depthChange
      if (depth !== 0) continue
      hiddenName = undefined
      visibleFrom = end
      continue
    }
    if (closing || !isInactiveAgreementElement(name, attributes)) continue
    parts.push(source.slice(visibleFrom, index))
    if (
      /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(
        name,
      )
    ) {
      visibleFrom = end
      continue
    }
    hiddenName = name
    depth = 1
    visibleFrom = source.length
  }
  return [...parts, source.slice(visibleFrom)].join(' ')
}
