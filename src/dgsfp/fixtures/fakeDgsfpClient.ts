import { vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { respondWith } from '../../sta/registry/fixtures/respondWith'
import type { FakeDgsfpClientExtras } from './/FakeDgsfpClientExtras'
import type { DgsfpCall } from './DgsfpCall'
import { dgsfpRoutes } from './dgsfpRoutes'

/** A client that answers the DGSFP sede's calls the way the live sede did on 2026-10-05; `override` replaces the answer for matching URLs. */
export const fakeDgsfpClient = (
  override?: readonly [
    (url: string) => boolean,
    (url: string, options?: HttpRequestOptions) => HttpResponse,
  ],
): HttpClient & FakeDgsfpClientExtras => {
  const calls: DgsfpCall[] = []
  return {
    calls,
    request: vi
      .fn<HttpClient['request']>()
      .mockImplementation(async (url, options) => {
        calls.push({ url, body: Buffer.from(options?.body ?? '').toString() })
        const routes = override ? [override, ...dgsfpRoutes] : dgsfpRoutes
        const answer = routes.find(([matches]) => matches(url))?.[1]
        return Promise.resolve(
          answer ? answer(url, options) : respondWith(url, 'not found', 404),
        )
      }),
    cookie: () => undefined,
  }
}
