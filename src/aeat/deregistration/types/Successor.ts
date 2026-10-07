/** One sucesor of an extinguished entity (036 page "13. Relación de sucesores"). */
export type Successor = {
  readonly nif: string
  readonly nombre: string
  /** % de liquidación/participación, as the 036 takes it (e.g. `50`). */
  readonly porcentaje: string
  /** Cuota de liquidación in euros, comma decimals (e.g. `0,00`). */
  readonly cuota: string
}
