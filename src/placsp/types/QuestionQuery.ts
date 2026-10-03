/** What `placsp pregunta` was asked to send, checked offline. */
export type QuestionQuery = {
  /** The canonical `deeplink:detalle_licitacion` link of the tender. */
  readonly tenderUrl: string
  readonly textFile: string
}
