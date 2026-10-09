import type { HttpClient } from '../../../http/types/HttpClient'
import { parseDocumentTypes } from '../parsers/parseDocumentTypes'
import type { RelecDocumentType } from '../types/RelecDocumentType'

/** The document types the form's selects offer: `POST /sta/ApordocAjaxLoader?getTypes=0`, an empty XHR. */
export const fetchDocumentTypes = async (
  client: HttpClient,
  origin: string,
): Promise<readonly RelecDocumentType[]> => {
  const response = await client.request(
    `${origin}/sta/ApordocAjaxLoader?getTypes=0`,
    {
      method: 'POST',
      body: '',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      defaultCharset: 'utf-8',
    },
  )
  if (response.status !== 200)
    throw new Error(`ApordocAjaxLoader answered ${String(response.status)}`)
  return parseDocumentTypes(response.text)
}
