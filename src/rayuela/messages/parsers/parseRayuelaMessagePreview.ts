import { htmlToText } from '../../../html/htmlToText'
import { unescapeHtml } from '../../../html/unescapeHtml'
import type { RayuelaMessagePreview } from '../types/RayuelaMessagePreview'
/** Decode the entity-escaped JSON before stripping the preview's HTML. */
export const parseRayuelaMessagePreview = (
  html: string,
): RayuelaMessagePreview => {
  const json =
    /<div\s[^>]*class=['"]jsonLinea['"][^>]*>([\s\S]*?)<\/div>/i.exec(html)?.[1]
  const data: unknown = JSON.parse(unescapeHtml(json ?? 'null'))
  if (
    !data ||
    typeof data !== 'object' ||
    !('ASUNTO' in data) ||
    typeof data.ASUNTO !== 'string' ||
    !('CUERPO_MENSAJE' in data) ||
    typeof data.CUERPO_MENSAJE !== 'string'
  )
    throw new Error('Rayuela message preview is invalid')
  return {
    subject: htmlToText(data.ASUNTO),
    body: htmlToText(data.CUERPO_MENSAJE),
  }
}
