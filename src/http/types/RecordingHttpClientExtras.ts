import type { Mock } from 'vitest'

import type { HttpClient } from './HttpClient'
import type { RecordedHttpCall } from './RecordedHttpCall'

/** What a fake HTTP client adds to HttpClient: the mocked request and the calls it recorded. */
export type RecordingHttpClientExtras = {
  request: Mock<HttpClient['request']>
  calls: RecordedHttpCall[]
}
