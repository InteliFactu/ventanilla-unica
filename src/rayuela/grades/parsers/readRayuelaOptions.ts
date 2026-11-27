import { htmlToText } from '../../../html/htmlToText'
import type { RayuelaOption } from '../types/RayuelaOption'
/** Read the options of one named select without following its handlers. */
export const readRayuelaOptions = (
  html: string,
  name: string,
): RayuelaOption[] => {
  const select = Array.from(
    html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi),
  ).find(
    (match) => /\bname=["']([^"']*)["']/i.exec(match[1] ?? '')?.[1] === name,
  )?.[2]
  return Array.from(
    (select ?? '').matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi),
    (match) => ({
      value: /\bvalue=["']([^"']*)["']/i.exec(match[1] ?? '')?.[1] ?? '',
      label: htmlToText(match[2] ?? ''),
      selected: /\bselected\b/i.test(match[1] ?? ''),
    }),
  )
}
