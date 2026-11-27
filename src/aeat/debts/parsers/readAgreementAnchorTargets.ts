import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'
import { readAgreementMarkupTags } from './readAgreementMarkupTags'
import { stripInactiveAgreementMarkup } from './stripInactiveAgreementMarkup'

/** Read links from anchors and the portal's explicit Ventana handler. */
export const readAgreementAnchorTargets = (html: string): readonly string[] => {
  const targets: string[] = []
  for (const [tag, closing, name] of readAgreementMarkupTags(
    stripInactiveAgreementMarkup(html),
  )) {
    if (closing || name?.toLowerCase() !== 'a') continue
    const href = readAttribute(tag, 'href')
    if (href) targets.push(unescapeHtml(href))
    const onclick = unescapeHtml(readAttribute(tag, 'onclick') ?? '').trim()
    const windowTarget =
      /^Ventana\((["'])([^"']+)\1\);(?:\s*return false;)?$/i.exec(onclick)?.[2]
    if (windowTarget) targets.push(windowTarget)
  }
  return targets
}
