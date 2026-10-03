/**
 * One row of "Certificado ROLECE > Emisión": the operator searched for and
 * its name, or the portal's "NO INSCRITO EN EL REGISTRO" in place of a name.
 */
export type RoleceCertificateRow = {
  readonly nif: string
  readonly denominacion: string
  readonly inscribed: boolean
}
