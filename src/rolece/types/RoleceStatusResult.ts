import type { RoleceCertificateRow } from './RoleceCertificateRow'

/** The answer of `rolece estado`. */
export type RoleceStatusResult = {
  readonly nif: string
  /** Inscribed in ROLECE, as the certificate search answers. */
  readonly registered: boolean
  /** True when the application screen would start an initial (first) inscription. */
  readonly initialApplication: boolean
  readonly certificate: {
    readonly rows: readonly RoleceCertificateRow[]
    /** Files written under `--out`; always empty for now (see notes). */
    readonly downloaded: readonly string[]
  }
  readonly notes: readonly string[]
}
