import type { Mock } from 'vitest'
import { vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'

/** A client answering the given responses in order; any further request fails the test. */
export const fakeCarpetaClient = (
  ...answers: readonly HttpResponse[]
): {
  readonly request: Mock<HttpClient['request']>
  readonly cookie: HttpClient['cookie']
} => {
  const request = vi.fn<HttpClient['request']>()
  for (const answer of answers) request.mockResolvedValueOnce(answer)
  request.mockRejectedValue(new Error('unexpected request'))
  return { request, cookie: () => undefined }
}
