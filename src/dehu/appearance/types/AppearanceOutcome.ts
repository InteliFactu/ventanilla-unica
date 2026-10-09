import type { DownloadedFile } from '../../documents/types/DownloadedFile'

/**
 * What happened to one requested notification. `accepted` is `false` when the
 * run only planned, or when DEHU refused the acceptance (`status` says how);
 * `notPending` marks an identifier that is not among the pending ones;
 * `error` carries why the attempt failed before DEHU answered at all;
 * `downloadError` why saving the files failed after an acceptance that stands.
 */
export type AppearanceOutcome = {
  readonly id: string
  readonly reference?: string | undefined
  readonly subject?: string | undefined
  readonly issuer?: string | undefined
  readonly expiresAt?: string | undefined
  readonly notPending?: true | undefined
  readonly accepted: boolean
  readonly status?: number | undefined
  readonly files?: readonly DownloadedFile[] | undefined
  readonly error?: string | undefined
  readonly downloadError?: string | undefined
}
