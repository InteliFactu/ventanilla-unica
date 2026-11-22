import type { HttpClient } from '../../../http/types/HttpClient'

/**
 * One simulator conversation. ZK numbers every `zkau` request through the
 * ZK-SID header and answers a repeated number with the cached reply of the
 * previous request, so the counter moves on every event.
 */
export type DraftSession = {
  readonly client: HttpClient
  /** Host of the form: the open simulator (www2) or the presentation form (www1). */
  readonly baseUrl: string
  /** The form's ZK update endpoint, e.g. `/wlpl/A303-FWME/pwda/zkau` on its host. */
  readonly zkauUrl: string
  readonly desktopId: string
  readonly pageUrl: string
  sid: number
}
