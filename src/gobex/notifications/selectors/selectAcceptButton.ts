import { readAttribute } from '../../../html/readAttribute'

/**
 * The button that really accepts a notification on `firmarAcuseRecibo.jsf`.
 * "Firmar documento <asunto>" only shows the modal panel `…:panelAceptar1`
 * ("Va a proceder a aceptar la notificación"); the act is that panel's own
 * `bt_aceptar.gif` image button. Its name is a `j_id`, so it is found inside
 * the panel: from the panel's id up to the RichFaces resizers that close it.
 */
export const selectAcceptButton = (html: string): string | undefined => {
  const open = /id="([^"]*panelAceptar1)"/.exec(html)
  if (!open?.[1]) return undefined
  const end = html.indexOf(`id="${open[1]}Resizer`, open.index)
  const panel = html.slice(open.index, end === -1 ? undefined : end)
  const button = [...panel.matchAll(/<input\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .find(
      (tag) =>
        readAttribute(tag, 'type')?.toLowerCase() === 'image' &&
        (readAttribute(tag, 'src') ?? '').includes('bt_aceptar'),
    )
  return button ? readAttribute(button, 'name') : undefined
}
