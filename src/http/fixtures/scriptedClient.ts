import { vi } from 'vitest'

import type { HttpClient } from '../types/HttpClient'
import type { HttpResponse } from '../types/HttpResponse'

/** A client that answers each request with the next scripted response, and records the calls. */
export const scriptedClient = (
  ...answers: HttpResponse[]
): HttpClient & {
  request: ReturnType<typeof vi.fn<HttpClient['request']>>
} => {
  const request = vi.fn<HttpClient['request']>()
  for (const answer of answers) request.mockResolvedValueOnce(answer)
  return { request, cookie: () => undefined }
}
