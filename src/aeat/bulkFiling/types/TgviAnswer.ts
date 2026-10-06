/** What a TGVI call answers in its response headers (the bodies are empty). */
export type TgviAnswer = {
  /** 0 is success; 8888 a warning; 2004 "send the next block". */
  readonly codigo: number
  readonly mensaje: string
  readonly idEnvio?: string | undefined
  readonly siguienteBloque?: number | undefined
  readonly correctos?: number | undefined
  readonly erroneos?: number | undefined
  readonly avisos: boolean
  readonly csv?: string | undefined
}
