/** The "Firmar y Enviar" window: who signs, for whom, and the type 1 record the AEAT will register. */
export type BulkSignatureDialog = {
  readonly idEnvio: string
  readonly nif: string
  readonly nombre: string
  readonly header: string
}
