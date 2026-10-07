import type { HttpClient } from '../../../http/types/HttpClient'

/** The portal client and the authentication data a notification download runs under. */
export type NotificationDownloadSession = {
  readonly client: HttpClient
  readonly authData: string
}
