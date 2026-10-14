/** The survey to assign: the nº de orden and contraseña of the INE letter, and whether IRIA mails a notice. */
export type IriaAssignmentRequest = {
  readonly numeroOrden: string
  readonly contrasena: string
  readonly avisoCorreo: boolean
}
