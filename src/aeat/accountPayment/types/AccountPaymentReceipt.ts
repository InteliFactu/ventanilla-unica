/** A payment the AEAT accepted: the NRC is the proof the debt is paid. */
export type AccountPaymentReceipt = {
  readonly modelo: string
  readonly justificante: string
  readonly importe: string
  /** Número de Referencia Completo: the justificante followed by nine characters. */
  readonly nrc: string
  /** The official receipt PDF, when --out was given. */
  readonly pdfPath?: string | undefined
}
