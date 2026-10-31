/** The informe de actividades de trabajo autónomo: where its PDF was saved, and its size. */
export type AutonomousActivitiesResult = {
  readonly pdfPath?: string | undefined
  readonly bytes: number
  readonly notes: readonly string[]
}
