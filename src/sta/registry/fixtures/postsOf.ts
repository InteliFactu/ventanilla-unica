import type { HttpClient } from '../../../http/types/HttpClient'
import type { RecordedPost } from '../types/RecordedPost'
import type { RecordedRequestMock } from '../types/RecordedRequestMock'

/** Every POST a fake registry client received, with its body as text. */
export const postsOf = (client: HttpClient): RecordedPost[] =>
  (client.request as unknown as RecordedRequestMock).mock.calls
    .filter(([, options]) => options?.method === 'POST')
    .map(([url, options]) => ({ url, body: String(options?.body ?? '') }))
