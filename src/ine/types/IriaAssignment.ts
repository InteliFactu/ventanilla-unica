/** `ine asignar`: the plan, or the portal's answer once confirmed. */
export type IriaAssignment = {
  readonly confirmed: boolean
  readonly numeroOrden: string
  readonly avisoCorreo: boolean
  readonly messages: readonly string[]
}
