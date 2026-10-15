import { htmlToText } from '../../../html/htmlToText'
/** Labelled values use columnaValor fonts inside layout cells. */
export const readRayuelaFields = (html: string): ReadonlyMap<string, string> =>
  new Map(
    Array.from(
      html.matchAll(
        /([^<>:]+):(?:\s|&nbsp;|<br\s*\/?>)*<font\s[^>]*class=["']columnaValor["'][^>]*>([\s\S]*?)<\/font>/gi,
      ),
      (match) => [htmlToText(match[1] ?? ''), match[2] ?? ''],
    ),
  )
