import type { DgsfpHolder } from './DgsfpHolder'

/** An authenticated session: the SharePoint form digest every service call carries, and the holder. */
export type DgsfpSession = {
  readonly digest: string
  readonly holder: DgsfpHolder
}
