import type { RegistrySummary } from './RegistrySummary'

/** `registry/searchRegistry`; `page` is the requested page minus one. */
export type RegistrySearchAnswer = {
  readonly numberOfElements: number
  readonly totalPage: number
  readonly items: readonly RegistrySummary[]
}
