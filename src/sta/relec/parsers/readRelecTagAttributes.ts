import { unescapeHtml } from '../../../html/unescapeHtml'

/** Read the attributes of a catalogue tag as HTML, taking the first duplicate. */
export const readRelecTagAttributes = (
  source: string,
): ReadonlyMap<string, string> => {
  const attributes = new Map<string, string>()
  for (const [, rawName = '', double, single, unquoted] of source.matchAll(
    /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
  )) {
    const name = rawName.toLowerCase()
    if (!attributes.has(name))
      attributes.set(name, unescapeHtml(double ?? single ?? unquoted ?? ''))
  }
  return attributes
}
