import { htmlToText } from '../../../html/htmlToText'

/** The domicile lines the "Domicilio" card displays, one per `<p>`. */
export const readAddressLines = (html: string): string[] => {
  const card =
    /id="tarjeta-datos-domicilio"[\s\S]*?<dd[^>]*>([\s\S]*?)<\/dd>/i.exec(
      html,
    )?.[1] ?? ''
  return [...card.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(([, line = '']) => htmlToText(line))
    .filter((line) => line !== '')
}
