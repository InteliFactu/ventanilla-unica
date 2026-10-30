/** One vehicle registered to the holder, as "Mis vehiculos" lists it. */
export type DgtVehicle = {
  readonly matricula: string
  /** First registration date, DD/MM/YYYY as the sede prints it. */
  readonly matriculacion: string
  readonly marca: string
  readonly modelo: string
  readonly combustible: string
}
