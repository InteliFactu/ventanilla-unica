import { readAttribute } from '../../../html/readAttribute'

/** Keep every copy of client-side JSF ViewState current across A4J fragments. */
export const mergeCarpetaFragment = (
  html: string,
  fragment: string,
): string => {
  if (fragment.includes('<form')) return fragment
  let merged = html
  for (const [tag] of fragment.matchAll(
    /<select\b[\s\S]*?<\/select>|<input\b[^>]*>/gi,
  )) {
    const id = readAttribute(tag, 'id')
    if (!id) continue
    const pattern = tag.startsWith('<select')
      ? /<select\b[\s\S]*?<\/select>/gi
      : /<input\b[^>]*>/gi
    const old = [...merged.matchAll(pattern)]
      .map(([item]) => item)
      .find((item) => readAttribute(item, 'id') === id)
    if (old) merged = merged.split(old).join(tag)
  }
  return merged
}
