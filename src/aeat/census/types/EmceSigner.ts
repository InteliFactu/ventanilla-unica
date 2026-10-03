import type { CensalCertificateRequest } from './CensalCertificateRequest'

/** Who fills the "firma básica" fields, given the confirmation page the validation answered. */
export type EmceSigner = (confirmationHtml: string) => CensalCertificateRequest
