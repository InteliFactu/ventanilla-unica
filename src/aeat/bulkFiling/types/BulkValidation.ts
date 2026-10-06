/** The AEAT's validation of every record of an envío; nothing is presented by it. */
export type BulkValidation = {
  readonly idEnvio: string
  readonly correctos: number
  readonly erroneos: number
  readonly avisos: boolean
  /** One line per failing record: the perceptor NIF (or "declarante") and the AEAT's message. */
  readonly errores: readonly string[]
}
