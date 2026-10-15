/** An open Atenea IRIS visor (`eje.justicia.es/visor-webapp`) for one expediente. */
export type VisorSession = {
  readonly url: string
  readonly csrf: string
  /** The Spring Web Flow execution key (`e1s1`) every AJAX call repeats. */
  readonly execution: string
  readonly codExpediente: string
  readonly procedimiento: string
}
