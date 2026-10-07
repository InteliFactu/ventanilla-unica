import { vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'
import type { RecordedHttpCall } from '../../../http/types/RecordedHttpCall'
import type { RecordingHttpClientExtras } from '../../../http/types/RecordingHttpClientExtras'
import type { FakeTgvi } from './FakeTgvi'
import { tgviAnswerFor } from './tgviAnswerFor'

/** A TGVI Online whose session starts in the holder's own name (00000000T). */
export const fakeTgviClient = (
  fake: FakeTgvi,
): HttpClient & RecordingHttpClientExtras => {
  const calls: RecordedHttpCall[] = []
  const request = vi.fn<HttpClient['request']>(
    async (url: string, options: HttpRequestOptions = {}) => {
      calls.push({ url, options })
      const { text, headers } = tgviAnswerFor(url, fake)
      return Promise.resolve({
        status: 200,
        url,
        headers,
        body: Buffer.from(text),
        text,
      })
    },
  )
  return { request, cookie: () => undefined, calls }
}
