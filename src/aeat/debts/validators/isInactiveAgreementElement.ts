import { unescapeHtml } from '../../../html/unescapeHtml'
import { isHiddenAgreementAttribute } from './isHiddenAgreementAttribute'

/** Recognize explicit HTML, accessibility and inline CSS hiding markers. */
export const isInactiveAgreementElement = (
  name: string,
  attributes: string,
): boolean => {
  if (name === 'template') return true
  for (const [, key = '', double, single, unquoted] of attributes.matchAll(
    /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
  )) {
    const value = unescapeHtml(double ?? single ?? unquoted ?? '').trim()
    if (isHiddenAgreementAttribute(key.toLowerCase(), value)) return true
  }
  return false
}
