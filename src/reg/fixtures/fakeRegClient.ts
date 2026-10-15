import { vi } from 'vitest'

import type { DgsfpCall } from '../../dgsfp/fixtures/DgsfpCall'
import type { FakeDgsfpClientExtras } from '../../dgsfp/fixtures/FakeDgsfpClientExtras'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { respondWith } from '../../sta/registry/fixtures/respondWith'
import { regRoutes } from './regRoutes'

/** A client answering the REG and Cl@ve like the live ones; `override` replaces the answer for matching URLs. */
export const fakeRegClient = (
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
        const routes = override ? [override, ...regRoutes] : regRoutes
        const answer = routes.find(([matches]) => matches(url))?.[1]
        return Promise.resolve(
          answer ? answer(url, options) : respondWith(url, 'not found', 404),
        )
      }),
    cookie: () => undefined,
  }
}
