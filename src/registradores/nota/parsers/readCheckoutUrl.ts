import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/**
 * The hosted card checkout `pago-orden` auto-posts to (`redsys_form`, today a
 * Worldline `hostedcheckout/Payment/Form/<id>` page), or undefined. Only a
 * plain https URL is accepted: it is handed to a browser and written into a
 * local page.
 */
export const readCheckoutUrl = (html: string): string | undefined => {
  const form = /<form\s[^>]*id="redsys_form"[^>]*>/i.exec(html)
  const action = form ? readAttribute(form[0], 'action') : undefined
  const url = action === undefined ? undefined : unescapeHtml(action)
  return url !== undefined && /^https:\/\/[^\s"'<>]+$/.test(url)
    ? url
    : undefined
}
