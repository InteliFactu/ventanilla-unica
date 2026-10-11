import type { HttpClient } from '../../../http/types/HttpClient'

/**
 * One simulator conversation. ZK numbers every `zkau` request through the
 * ZK-SID header and answers a repeated number with the cached reply of the
 * previous request, so the counter moves on every event.
 */
export type DraftSession = {
  readonly client: HttpClient
  readonly modelo: string
  readonly desktopId: string
  readonly pageUrl: string
  sid: number
}
