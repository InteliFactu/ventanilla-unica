import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'

/** Who files an entry, whether the run is confirmed and where to save the justificante. */
export type StaRegistryFilingContext = {
  readonly identity: CertificateIdentity
  readonly confirmed: boolean
  readonly outDir?: string | undefined
}
