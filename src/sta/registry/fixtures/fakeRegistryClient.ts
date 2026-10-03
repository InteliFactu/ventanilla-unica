import { vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { registryRoutes } from './registryRoutes'
import { respondWith } from './respondWith'

/** A client that answers the Junta registry SPA's calls the way the live sede did on 2026-10-03. */
export const fakeRegistryClient = (): HttpClient => {
  return {
    request: vi
      .fn<HttpClient['request']>()
      .mockImplementation(async (url, options) => {
        const answer = registryRoutes.find(([matches]) => matches(url))?.[1]
        return Promise.resolve(
          answer ? answer(url, options) : respondWith(url, 'not found', 404),
        )
      }),
    cookie: () => 'csrf-token',
  }
}
