/** The declarant (type 1 record) data of a modelo 190 file that the perceptor rows do not carry. */
export type Model190Declarant = {
  readonly ejercicio: string
  readonly nif: string
  readonly nombre: string
  /** Nine digits: the phone of the person the AEAT should contact. */
  readonly telefono: string
  /** Surnames and name of that person. */
  readonly contacto: string
  readonly correo: string
}
