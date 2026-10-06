import type { HttpClient } from '../../../http/types/HttpClient'
import { bulkFilingUrls } from '../bulkFilingUrls'
import { readTgviAnswer } from '../parsers/readTgviAnswer'
import type { TgviAnswer } from '../types/TgviAnswer'

/** One TGVI XHR call: parameters in headers, records or the acceptance as a UTF-8 text body. */
export const postTgvi = async (
  client: HttpClient,
  url: string,
  headers: Readonly<Record<string, string>>,
  body: string,
): Promise<TgviAnswer> => {
  const response = await client.request(url, {
    method: 'POST',
    referer: bulkFilingUrls.page,
    headers: { ...headers, 'Content-Type': 'text/plain;charset=UTF-8' },
    body: Buffer.from(body, 'utf8'),
  })
  if (response.status !== 200)
    throw new Error(`TGVI: ${url} answered HTTP ${String(response.status)}`)
  return readTgviAnswer(response.headers)
}
