/**
 * The `<TEXTO>` of every `<MESSAGE>` whose `<TIPO>` is ERROR, whitespace
 * collapsed. Prosa keeps the request's `DOCDocumento` in the audit block of
 * a refusal, so an ERROR message is what tells a refusal from a document.
 */
export const readXmlErrorMessages = (xml: string): readonly string[] => {
  const pattern =
    /<MESSAGE>\s*<TIPO>\s*ERROR\s*<\/TIPO>\s*<TEXTO><!\[CDATA\[([\s\S]*?)\]\]><\/TEXTO>/g
  return [...xml.matchAll(pattern)].map((match) =>
    (match[1] ?? '').replaceAll(/\s+/g, ' ').trim(),
  )
}
