/** Step 2's notification-address radio activates exactly one address group. */
export const isYouthGuaranteeActiveAddressField = (
  name: string,
  mode: string | undefined,
): boolean => {
  if (name.startsWith('datosContacto.notificaApartadoCorreos.'))
    return mode === 'A'
  if (
    name.startsWith('datosDireccionContacto.') &&
    name !== 'datosDireccionContacto.tipoDomicilioC'
  )
    return mode === 'C'
  return true
}
