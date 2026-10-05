import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { dgsfpLoginRoutes } from './dgsfpLoginRoutes'
import { dgsfpServiceRoutes } from './dgsfpServiceRoutes'

/** Every DGSFP sede call a fake client answers, each a URL test and its canned answer. */
export const dgsfpRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [...dgsfpLoginRoutes, ...dgsfpServiceRoutes]
