import type { HttpResponse } from '../../http/types/HttpResponse'
import { respondWith } from '../../sta/registry/fixtures/respondWith'

/** A 200 answer whose body is the value as JSON. */
export const respondJson = (url: string, value: unknown): HttpResponse =>
  respondWith(url, JSON.stringify(value))
