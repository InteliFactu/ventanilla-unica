import { unescapeHtml } from '../../../html/unescapeHtml'

/** The Atenea IRIS visor link an expediente's detail page carries, absent when the holder has no access to its documents. */
export const selectVisorLink = (html: string): string | undefined => {
  const link = /href="(https:\/\/eje\.justicia\.es\/visor-webapp\/[^"]+)"/.exec(
    html,
  )?.[1]
  return link === undefined ? undefined : unescapeHtml(link)
}
