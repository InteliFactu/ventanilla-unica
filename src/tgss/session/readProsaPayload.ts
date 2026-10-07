import { readAttribute } from '../../html/readAttribute'
import type { ProsaPayload } from '../prosa/types/ProsaPayload'

/** Pull the rotating ticket and the ProsaXMLData payload out of a Prosa page. */
export const readProsaPayload = (html: string): ProsaPayload => {
  const ticketTag = /<[^>]*\bid="ARQ\.SPM\.TICKET"[^>]*>/.exec(html)?.[0]
  const ticket = ticketTag ? readAttribute(ticketTag, 'value') : undefined
  const xml = /<script id="xml"[^>]*>([\s\S]*?)<\/script>/
    .exec(html)?.[1]
    ?.trim()
  if (!ticket || !xml)
    throw new Error('TGSS: no Prosa ticket or XML payload in the response')
  return { ticket, xml }
}
