/** One activity of the 036 page 4, as the AEAT activity finder returns it. */
export type EconomicActivity = {
  /** Código y tipo de actividad (casilla 403): A03 resto empresariales, A04 artísticas, A05 profesionales. */
  readonly tipo: string
  /** Sección de las tarifas del IAE: 1 empresarial, 2 profesional, 3 artística. */
  readonly seccion: string
  /** Grupo o epígrafe without dots, as the finder sends it (`763`, `9654`). */
  readonly epigrafe: string
  /** Descripción de la actividad (casilla 400). */
  readonly descripcion: string
}
