import type { AddressUpdate } from '../types/AddressUpdate'

/**
 * The fields the "Modificar domicilio" modal would post for a Spanish address
 * (`pais` 724). `direccionCompleta` and `localidadYcp` belong to the foreign
 * address variant and stay empty.
 */
export const mapAddressFormFields = (
  update: AddressUpdate,
): Record<string, string> => ({
  pais: '724',
  ...update,
  direccionCompleta: '',
  localidadYcp: '',
  accion: 'ACC_GUARDAR_DOMICILIO',
})
