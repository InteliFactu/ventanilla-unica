/**
 * The uuid of the ZK button with one sclass, or undefined when the page has
 * none: the nearest `Button','<uuid>'` before the `sclass:'<sclass>'` mark.
 */
export const parseZkButtonUuid = (
  html: string,
  sclass: string,
): string | undefined => {
  const mark = html.indexOf(`sclass:'${sclass}'`)
  if (mark < 0) return undefined
  const start = html.lastIndexOf("Button','", mark)
  if (start < 0) return undefined
  return /^Button','(\w+)'/.exec(html.slice(start))?.[1]
}
