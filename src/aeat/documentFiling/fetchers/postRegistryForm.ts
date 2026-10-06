import { encodeLatin1Form } from '../../../http/encodeLatin1Form'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { AeatPage } from '../types/AeatPage'

/** POST a registry form as the page's browser does: ISO-8859-1 url-encoded, answered in ISO-8859-15. */
export const postRegistryForm = async (
  client: HttpClient,
  url: string,
  fields: Readonly<Record<string, string>>,
  referer: string,
): Promise<AeatPage> => {
  const response = await client.request(url, {
    method: 'POST',
    referer,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeLatin1Form(fields),
    defaultCharset: 'iso-8859-15',
  })
  if (response.status !== 200)
    throw new Error(
      `AEAT: the registry answered HTTP ${String(response.status)} at ${url}`,
    )
  return { url: response.url, html: response.text }
}
