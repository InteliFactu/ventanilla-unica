import type { HttpClient } from '../../../http/types/HttpClient'
import { parseContactDefaults } from '../parsers/parseContactDefaults'
import { parseRelecHolderContact } from '../parsers/parseRelecHolderContact'
import type { RelecContact } from '../types/RelecContact'

/** The contact script needs the same session's opened Relec form; login alone returns HTTP 500. */
export const fetchRelecHolderContact = async (
  client: HttpClient,
  origin: string,
  html: string,
): Promise<RelecContact> => {
  if (!html.includes('pages/relec/form/contactways_js.jsp'))
    return parseContactDefaults(html)
  const response = await client.request(
    `${origin}/sta/pages/relec/form/contactways_js.jsp`,
    { defaultCharset: 'iso-8859-1' },
  )
  if (response.status !== 200)
    throw new Error(
      `the holder contact script answered ${String(response.status)}`,
    )
  return parseRelecHolderContact(response.text)
}
