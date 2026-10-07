import type { vi } from 'vitest'

import type { HttpClient } from './HttpClient'

/** What a scripted client adds to HttpClient: its mocked request. */
export type ScriptedClientExtras = {
  request: ReturnType<typeof vi.fn<HttpClient['request']>>
}
