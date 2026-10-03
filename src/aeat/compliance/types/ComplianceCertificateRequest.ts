import type { CompliancePurpose } from './CompliancePurpose'

/** Who the "certificado de estar al corriente" is asked for, and to what end. */
export type ComplianceCertificateRequest = {
  readonly nif: string
  readonly purpose: CompliancePurpose
}
