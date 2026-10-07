import { vi } from 'vitest'

import type { HttpClient } from '../types/HttpClient'
import type { HttpResponse } from '../types/HttpResponse'
import type { ScriptedClientExtras } from '../types/ScriptedClientExtras'

/** A client that answers each request with the next scripted response, and records the calls. */
export const scriptedClient = (
  ...answers: HttpResponse[]
): HttpClient & ScriptedClientExtras => {
  const request = vi.fn<HttpClient['request']>()
  for (const answer of answers) request.mockResolvedValueOnce(answer)
  return { request, cookie: () => undefined }
}
