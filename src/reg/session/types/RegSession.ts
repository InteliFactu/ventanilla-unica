import type { RegUser } from './RegUser'

/** What every API call needs: the bearer token and the holder it belongs to. */
export type RegSession = {
  readonly token: string
  readonly holder: RegUser
}
