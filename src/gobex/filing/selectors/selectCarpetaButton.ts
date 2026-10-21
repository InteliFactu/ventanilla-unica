import { readAttribute } from '../../../html/readAttribute'

/** Resolve the live A4J component behind a specific button image, never a numeric hard-coded id. */
export const selectCarpetaButton = (html: string, image: string): string => {
  const tag = [...html.matchAll(/<(?:input|img)\b[^>]*>/gi)]
    .map(([item]) => item)
    .find(
      (item) =>
        (readAttribute(item, 'src') ?? '').includes(image) &&
        !item.includes('aceptarOK2'),
    )
  const name = tag
    ? (/'similarityGroupingId':'([^']+)'/.exec(
        readAttribute(tag, 'onclick') ?? '',
      )?.[1] ?? readAttribute(tag, 'name'))
    : undefined
  if (!name) throw new Error(`Junta: no ${image} button on this page`)
  return name
}
