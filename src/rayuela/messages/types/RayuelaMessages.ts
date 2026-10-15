import type { RayuelaMessage } from './RayuelaMessage'

export type RayuelaMessages = {
  readonly messages: readonly RayuelaMessage[]
  readonly total: number
  readonly notes: readonly string[]
}
