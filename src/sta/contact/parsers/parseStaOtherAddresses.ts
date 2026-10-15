import { htmlToText } from '../../../html/htmlToText'

/** The "Otras direcciones" list of the datos personales page: one `<div>` per address. */
export const parseStaOtherAddresses = (html: string): readonly string[] => {
  const block = /Otras direcciones<\/div>\s*<dl[^>]*>([\s\S]*?)<\/dl>/.exec(
    html,
  )?.[1]
  return [...(block ?? '').matchAll(/<div>([\s\S]*?)<\/div>/g)]
    .map(([, address = '']) => htmlToText(address))
    .filter(Boolean)
}
