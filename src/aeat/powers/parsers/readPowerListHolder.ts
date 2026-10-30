import { htmlToText } from '../../../html/htmlToText'

/** The NIF the page's search conditions name as poderdante (granted list) or apoderado (received list); undefined when it names none. */
export const readPowerListHolder = (html: string): string | undefined =>
  /(?:Poderdante|Apoderado)\s*=\s*:\s*([0-9A-Z]{9})\s*-/.exec(
    htmlToText(html),
  )?.[1]
