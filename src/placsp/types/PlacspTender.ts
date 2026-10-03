/** The public detail of one PLACSP tender, as `placsp pregunta` checks it before planning. */
export type PlacspTender = {
  readonly expediente: string
  readonly organoContratacion: string
  readonly objeto: string
  /** "Publicada", "Evaluación", "Adjudicada", "Resuelta"... */
  readonly estado: string
  /** End of the submission period as the page shows it ("19/10/2026 23:59"). */
  readonly finPresentacion?: string | undefined
  readonly enlace: string
}
