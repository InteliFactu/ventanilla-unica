/**
 * Headers of a `FileUploaderApplet` call as Prototype's `Ajax.Request` sends
 * them from the signing page: a text/plain body and the operation in
 * `callOpAction` plus its own headers.
 */
export const relecAppletHeaders = (
  operation: Readonly<Record<string, string>>,
): Record<string, string> => ({
  Accept: 'text/javascript, text/html, application/xml, text/xml, */*',
  'Content-Type': 'text/plain',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Prototype-Version': '1.7.3',
  ...operation,
})
