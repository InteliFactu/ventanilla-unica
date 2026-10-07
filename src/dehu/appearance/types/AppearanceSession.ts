import type { HttpClient } from '../../../http/types/HttpClient'

/** The client, the listing session's bearer JWT and the legal text the acceptance is given under. */
export type AppearanceSession = {
  readonly client: HttpClient
  readonly authData: string
  readonly legalTextId: string
}
