import type { CompliancePurpose } from './CompliancePurpose'

/** The JSON `ventanilla-unica aeat certificado-corriente` prints. */
export type ComplianceCertificateResult = {
  readonly nif: string
  /** The holder's name as the AEAT spells it on the signature screen. */
  readonly nombre: string
  readonly purpose: CompliancePurpose
  readonly label: string
  readonly csv: string
  /** POSITIVO (true) or NEGATIVO (false), read from the PDF text; undefined when the text states neither. */
  readonly positive: boolean | undefined
  readonly pdfPath?: string | undefined
  readonly bytes: number
  readonly notes: readonly string[]
}
