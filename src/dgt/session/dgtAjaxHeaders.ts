/**
 * The headers the sede's jQuery calls carry. The JSP services sit under
 * `/system/...`, where the gateway refuses a request "by policy" if it
 * carries the `Path=/es` session cookies a browser would never send there;
 * the jar's path scoping keeps them off.
 */
export const dgtAjaxHeaders: Readonly<Record<string, string>> = {
  'X-Requested-With': 'XMLHttpRequest',
  Accept: 'application/json, text/javascript, */*; q=0.01',
}
