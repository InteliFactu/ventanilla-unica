import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { regApiRoutes } from './regApiRoutes'
import { regLoginRoutes } from './regLoginRoutes'

/** Every route a fake REG client answers. */
export const regRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [...regLoginRoutes, ...regApiRoutes]
