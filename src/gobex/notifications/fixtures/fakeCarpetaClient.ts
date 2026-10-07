import { vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { FakeCarpetaClient } from '../types/FakeCarpetaClient'

/** A client answering the given responses in order; any further request fails the test. */
export const fakeCarpetaClient = (
  ...answers: readonly HttpResponse[]
): FakeCarpetaClient => {
  const request = vi.fn<HttpClient['request']>()
  for (const answer of answers) request.mockResolvedValueOnce(answer)
  request.mockRejectedValue(new Error('unexpected request'))
  return { request, cookie: () => undefined }
}
