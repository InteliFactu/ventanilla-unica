/**
 * One perceptor row (type 2 record), amounts in cents. Only claves A and L
 * are supported; for L the birth year, family situation and contract are
 * written as zeros, because the design asks for them only under A, B and C.
 */
export type Model190Perceptor = {
  readonly nif: string
  readonly nombre: string
  /** Two-digit province code of the perceptor's address (10 = Cáceres). */
  readonly provincia: string
  readonly clave: 'A' | 'L'
  /** Two digits under L; `00` under A, which has no subclave. */
  readonly subclave: string
  readonly percepcion: number
  readonly retencion: number
  /** Social Security paid by the worker (gastos deducibles, art. 19.2 a LIRPF). */
  readonly gastos: number
  readonly nacimiento: string
  /** 1, 2 or 3 (3: other or not stated). */
  readonly situacion: string
  /** 1 general, 2 under a year, 3 special relation, 4 day labourer. */
  readonly contrato: string
}
